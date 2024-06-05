import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function classname(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getClassPrefix() {
  return (window as any).__TDESIGN_THEME_PREFIX__ || 't';
}
