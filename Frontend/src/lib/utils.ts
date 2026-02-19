import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function resizeImage(url: string | undefined): string {
    if (!url) return "";
    // If already proxied, do nothing
    if (url.includes('phimapi.com/image.php')) return url;

    // Ensure absolute URL
    let fullUrl = url;
    if (!url.startsWith('http')) {
        // Use phimimg.com as base for relative paths based on user example
        fullUrl = `https://phimimg.com/${url.startsWith('/') ? url.slice(1) : url}`;
    }

    return `https://phimapi.com/image.php?url=${encodeURIComponent(fullUrl)}`;
}
