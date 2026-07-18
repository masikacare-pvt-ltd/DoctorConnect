export interface CompressedImage {
  blob: Blob;
  width: number;
  height: number;
  dataUrl: string;
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

function drawToCanvas(img: HTMLImageElement, maxDim: number, quality: number): Promise<CompressedImage> {
  return new Promise((resolve, reject) => {
    let { width, height } = img;
    if (width > height && width > maxDim) {
      height = Math.round((height * maxDim) / width);
      width = maxDim;
    } else if (height > maxDim) {
      width = Math.round((width * maxDim) / height);
      height = maxDim;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas not supported'));
      return;
    }
    ctx.drawImage(img, 0, 0, width, height);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Compression failed'));
          return;
        }
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({ blob, width, height, dataUrl });
      },
      'image/jpeg',
      quality,
    );
  });
}

export async function compressImageFile(
  file: File,
  opts: { maxDim?: number; quality?: number } = {},
): Promise<CompressedImage> {
  const maxDim = opts.maxDim ?? 1600;
  const quality = opts.quality ?? 0.8;
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
  const img = await loadImageElement(dataUrl);
  return drawToCanvas(img, maxDim, quality);
}

export function validateImageFile(file: File, maxBytes = 15 * 1024 * 1024): string | null {
  if (!file.type.startsWith('image/')) return 'Only image files are supported.';
  if (file.size > maxBytes) return 'File exceeds 15MB limit.';
  return null;
}
