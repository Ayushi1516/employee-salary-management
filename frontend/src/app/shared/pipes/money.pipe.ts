import { Pipe, PipeTransform } from '@angular/core';

/** {{ 50000 | money:'INR' }} -> "₹50,000". Missing values show "--", never "NaN". */
@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(value: number | null | undefined, currency = 'USD', maxFractionDigits = 0): string {
    if (value === null || value === undefined) return '--';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: maxFractionDigits,
    }).format(value);
  }
}
