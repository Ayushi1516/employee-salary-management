import { Pipe, PipeTransform } from '@angular/core';

/** {{ 1250000 | compactUsd }} -> "$1.25M" (for KPI cards and charts). */
@Pipe({ name: 'compactUsd' })
export class CompactUsdPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '--';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value);
  }
}
