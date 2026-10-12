import { Pipe, PipeTransform } from '@angular/core';
import { COUNTRIES } from '../../core/constants/reference-data.constants';

/** {{ 'IN' | countryName }} -> "India". Unknown codes are shown as-is. */
@Pipe({ name: 'countryName' })
export class CountryNamePipe implements PipeTransform {
  transform(code: string | null | undefined): string {
    if (!code) return '--';
    return COUNTRIES.find((c) => c.code === code)?.name ?? code;
  }
}
