import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getSocketUrl } from "./socket"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getServerUrl(): string {
  return getSocketUrl();
}

export function getFileUrl(filePath?: string | null): string {
  if (!filePath) return '';
  const normalizedPath = filePath.replace(/\\/g, '/');
  if (normalizedPath.startsWith('http') || normalizedPath.startsWith('data:') || normalizedPath.startsWith('blob:')) {
    return normalizedPath;
  }
  const origin = getSocketUrl();
  return `${origin}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
}

export function getImageUrl(imagePath?: string | null): string | undefined {
  if (!imagePath) return undefined;
  return getFileUrl(imagePath);
}
