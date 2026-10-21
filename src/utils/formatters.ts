/**
 * Format currency in Central African CFA Franc (XAF / FCFA)
 */
export function formatXAF(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 FCFA';
  return new Intl.NumberFormat('fr-CM', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA';
}

/**
 * Format phone numbers to Cameroonian format (+237 6XX XX XX XX)
 */
export function formatCameroonPhone(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+237')) {
    const rest = cleaned.slice(4);
    if (rest.length === 9) {
      return `+237 ${rest.slice(0, 3)} ${rest.slice(3, 5)} ${rest.slice(5, 7)} ${rest.slice(7, 9)}`;
    }
  }
  return phone;
}

/**
 * Validate Cameroonian phone number (starts with +237 or 6 followed by 8 digits)
 */
export function isValidCameroonPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^(\+237)?[623]\d{8}$/.test(cleaned);
}

/**
 * Format friendly date
 */
export function formatDate(dateString: string, lang: 'fr' | 'en' = 'en'): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}
