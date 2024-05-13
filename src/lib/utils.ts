import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDuration = (durationInSeconds: number | string) => {
  const minutes = Math.floor(Number(durationInSeconds) / 60);
  const seconds = Math.round(Number(durationInSeconds) % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
