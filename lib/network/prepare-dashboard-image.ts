type DecodedImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
  dispose: () => void;
};

const HEIC_TYPES = new Set(["image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"]);

function looksLikeHeic(file: File) {
  return HEIC_TYPES.has(file.type.toLowerCase()) || /\.(heic|heif)$/i.test(file.name);
}

async function convertHeicForBrowser(file: File) {
  try {
    const { default: heic2any } = await import("heic2any");
    const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.94 });
    const blob = Array.isArray(converted) ? converted[0] : converted;
    if (!blob) throw new Error("heic-conversion-empty");
    return new File([blob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
      type: "image/jpeg",
    });
  } catch {
    throw new Error("I couldn't read that iPhone photo in this browser. Try sharing it again from Photos, or choose another picture.");
  }
}

async function decodeImage(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      return { source: bitmap, width: bitmap.width, height: bitmap.height, dispose: () => bitmap.close() };
    } catch {
      // Some mobile browsers decode camera formats through an image element.
    }
  }

  const url = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = "async";
  const loaded = new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("image-decode-failed"));
  });
  image.src = url;
  try {
    if (typeof image.decode === "function") await image.decode();
    else await loaded;
  } catch {
    try {
      await loaded;
    } catch {
      URL.revokeObjectURL(url);
      if (looksLikeHeic(file)) return decodeImage(await convertHeicForBrowser(file));
      throw new Error("I couldn't read that photo in this browser. Please choose another picture.");
    }
  }
  return { source: image, width: image.naturalWidth, height: image.naturalHeight, dispose: () => URL.revokeObjectURL(url) };
}

export async function cropImageForUpload(file: File, width: number, height: number, filename: string) {
  const decoded = await decodeImage(file);
  try {
    if (!decoded.width || !decoded.height) throw new Error("I couldn't read that photo. Please choose another image.");
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image processing is unavailable in this browser.");
    const scale = Math.max(width / decoded.width, height / decoded.height);
    const sourceWidth = width / scale;
    const sourceHeight = height / scale;
    context.drawImage(decoded.source, (decoded.width - sourceWidth) / 2, (decoded.height - sourceHeight) / 2, sourceWidth, sourceHeight, 0, 0, width, height);

    let outputType = "image/webp";
    let quality = 0.86;
    let blob: Blob | null = null;
    do {
      blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, outputType, quality));
      if (blob && blob.type !== outputType) {
        outputType = "image/jpeg";
        blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, outputType, quality));
      }
      quality -= 0.08;
    } while (blob && blob.size > 2 * 1024 * 1024 && quality >= 0.30);

    if (!blob) throw new Error("The photo could not be prepared. Please try another image.");
    if (blob.size > 2 * 1024 * 1024) throw new Error("The photo could not be reduced enough. Please try another image.");
    const extension = blob.type === "image/jpeg" ? "jpg" : "webp";
    return new File([blob], filename.replace(/\.[^.]+$/, `.${extension}`), { type: blob.type });
  } finally {
    decoded.dispose();
  }
}

export async function prepareFullImageForUpload(file: File, maxWidth: number, maxHeight: number, filename: string) {
  const decoded = await decodeImage(file);
  try {
    if (!decoded.width || !decoded.height) throw new Error("I couldn't read that photo. Please choose another image.");
    const scale = Math.min(1, maxWidth / decoded.width, maxHeight / decoded.height);
    const width = Math.max(1, Math.round(decoded.width * scale));
    const height = Math.max(1, Math.round(decoded.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image processing is unavailable in this browser.");
    context.drawImage(decoded.source, 0, 0, width, height);

    let outputType = "image/webp";
    let quality = 0.88;
    let blob: Blob | null = null;
    do {
      blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, outputType, quality));
      if (blob && blob.type !== outputType) {
        outputType = "image/jpeg";
        blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, outputType, quality));
      }
      quality -= 0.08;
    } while (blob && blob.size > 2 * 1024 * 1024 && quality >= 0.30);

    if (!blob) throw new Error("The photo could not be prepared. Please try another image.");
    if (blob.size > 2 * 1024 * 1024) throw new Error("The photo could not be reduced enough. Please try another image.");
    const extension = blob.type === "image/jpeg" ? "jpg" : "webp";
    return new File([blob], filename.replace(/\.[^.]+$/, `.${extension}`), { type: blob.type });
  } finally {
    decoded.dispose();
  }
}

export function friendlyDashboardImageError(error: unknown) {
  if (error instanceof DOMException && error.name === "AbortError") {
    return "That took too long. Check your connection, then try again.";
  }

  const message = error instanceof Error ? error.message : "";
  if (/^(I couldn't|The photo|Image processing)/.test(message)) return message;
  if (/fetch|network|connection|offline/i.test(message)) {
    return "I couldn't connect. Check your internet connection, then try again.";
  }
  return "I couldn't prepare that picture. Please try it again or choose another image.";
}
