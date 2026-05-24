export function clampToZero(value: number): number {
  return Math.max(value, 0);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidCurrency(code: string): boolean {
  return ['USD','NGN','EUR','GBP','CAD','AUD','SAR','AED','GHS','ZAR','PKR','INR','MYR','IDR'].includes(code);
}
