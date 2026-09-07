const OUTPUT_SIZE = 800;

type DecodedImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
  dispose: () => void;
};

async function decodeWithImageElement(file: File): Promise<DecodedImage> {
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = "async";
  const loaded = new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("image-decode-failed"));
  });
  image.src = url;

  try {
    await image.decode();
  } catch {
    await loaded;
  }

  return {
    source: image,
    width: image.naturalWidth,
    height: image.naturalHeight,
    dispose: () => URL.revokeObjectURL(url),
  };
}

async function decodeImage(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      // Do not pass imageOrientation here. Older Safari versions expose
      // createImageBitmap but reject the standard `from-image` enum value.
      const bitmap = await createImageBitmap(file);
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        dispose: () => bitmap.close(),
      };
    } catch {
      // Image elements cover older and partially implemented browsers.
    }
  }

  return decodeWithImageElement(file);
}

export async function prepareProfileImage(file: File, memberId: string) {
  const decoded = await decodeImage(file);

  try {
    const side = Math.min(decoded.width, decoded.height);
    if (!side) throw new Error("image-decode-failed");

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("image-processing-unavailable");

    context.drawImage(
      decoded.source,
      Math.max(0, (decoded.width - side) / 2),
      Math.max(0, (decoded.height - side) / 2),
      side,
      side,
      0,
      0,
      OUTPUT_SIZE,
      OUTPUT_SIZE,
    );

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.86),
    );
    if (!blob) throw new Error("image-processing-unavailable");

    return new File([blob], `${memberId}.webp`, { type: blob.type || "image/webp" });
  } finally {
    decoded.dispose();
  }
}

export function friendlyUploadError(error: unknown) {
  if (error instanceof DOMException && error.name === "AbortError") {
    return "That took too long. Check your connection, then try again.";
  }

  const message = error instanceof Error ? error.message : "";
  if (/^(Please|Choose|Send|We couldn't|The upload|This upload)/.test(message)) {
    return message;
  }
  if (/image|bitmap|decode|canvas|orientation|format/i.test(message)) {
    return "We couldn't read that picture. Try saving it as a JPG or PNG, then upload it again.";
  }
  if (/fetch|network|connection|offline/i.test(message)) {
    return "We couldn't connect. Check your internet connection, then try again.";
  }

  return "We couldn't upload your picture. Please try again or choose a different JPG or PNG.";
}
