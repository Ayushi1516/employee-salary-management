import { DecimalPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

/** Footer for tables: "Showing 1-25 of 10,000" with Previous / Next. Page numbers are zero-based. */
@Component({
  selector: 'app-pagination',
  imports: [DecimalPipe],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  page = input.required<number>();
  pageSize = input.required<number>();
  totalElements = input.required<number>();
  totalPages = input.required<number>();
  pageChange = output<number>();

  firstItem = computed(() => (this.totalElements() === 0 ? 0 : this.page() * this.pageSize() + 1));
  lastItem = computed(() => Math.min((this.page() + 1) * this.pageSize(), this.totalElements()));
  hasPrevious = computed(() => this.page() > 0);
  hasNext = computed(() => this.page() + 1 < this.totalPages());
}
