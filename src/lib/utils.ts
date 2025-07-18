import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const customLoader = ({ src }: { src: string }) => {
  try {
    new URL(src);
    return src;
  } catch {
    return "/placeholder.svg";
  }
};

export function formatTime(seconds: number): string {
    if (isNaN(seconds)) return "0:00"
  
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
  
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  
  export function formatDuration(seconds: number): string {
    if (isNaN(seconds)) return "0:00"
  
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
  
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }