import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function wait(second: number) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(true);
    }, 1000 * second)
  );
}
