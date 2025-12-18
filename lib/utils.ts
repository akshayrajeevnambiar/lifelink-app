// Utility functions for donor normalization and formatting

/**
 * Normalize a location string: trim and lowercase.
 */
export function normalizeLocation(str: string): string {
  return str.trim().toLowerCase();
}

/**
 * Normalize a phone string: keep only digits.
 */
export function normalizePhone(str: string): string {
  return str.replace(/\D/g, '');
}

/**
 * Format a string of digits as a phone number for display (North America style).
 * E.g., 4165551234 => (416) 555-1234
 * Falls back to raw digits if not 10 digits.
 */
export function formatPhoneForDisplay(digits: string): string {
  const cleaned = digits.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return cleaned;
}

// Usage examples
// console.log(normalizeLocation('  Toronto  ')); // 'toronto'
// console.log(normalizePhone('+1 (416) 555-1234')); // '14165551234'
// console.log(formatPhoneForDisplay('14165551234')); // '+1 (416) 555-1234'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
