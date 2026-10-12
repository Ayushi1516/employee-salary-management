import { Pipe, PipeTransform } from '@angular/core';

/** {{ employee | fullName }} -> "Ayushi Solanki" */
@Pipe({ name: 'fullName' })
export class FullNamePipe implements PipeTransform {
  transform(person: { firstName: string; lastName: string } | null | undefined): string {
    return person ? `${person.firstName} ${person.lastName}`.trim() : '';
  }
}
