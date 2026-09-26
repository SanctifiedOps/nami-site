type DecodedImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
  dispose: () => void;
};

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
  image.src = url;
  try {
    await image.decode();
  } catch {
    URL.revokeObjectURL(url);
    throw new Error("I couldn't read that photo. Please choose another image.");
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
