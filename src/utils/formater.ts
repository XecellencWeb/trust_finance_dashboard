// src/common/utils/formatter.util.ts
export class FormatterUtil {
  /**
   * Format a date to a localized string
   * @param date Date object or string
   * @param locale e.g. 'en-US', 'fr-FR'
   * @param options Intl.DateTimeFormatOptions
   */
  static formatDate(
    date: string | Date,
    locale: string = 'en-US',
    options?: Intl.DateTimeFormatOptions
  ): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    }).format(d);
  }

  /**
   * Format currency based on locale and currency code
   * @param amount The number to format
   * @param currency e.g. 'USD', 'NGN'
   * @param locale e.g. 'en-US', 'en-NG'
   */
  static formatCurrency(
    amount: number,
    currency: string = 'USD',
    locale: string = 'en-US'
  ): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  }

  /**
   * Format a phone number (basic international format)
   */
  static formatPhone(phone: string): string {
    return phone
      .replace(/\D/g, '')
      .replace(/^(\d{1,3})(\d{3})(\d{3,4})(\d+)$/, '+$1 $2 $3 $4');
  }

  /**
   * Format large numbers with commas
   */
  static formatNumber(num: number): string {
    return num.toLocaleString();
  }

  /**
   * Capitalize each word in a sentence
   */
  static capitalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  /**
   * Truncate long text with ellipsis
   * @param text string to truncate
   * @param maxLength max characters to keep
   */
  static truncateText(text: string, maxLength: number = 50): string {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }
}
