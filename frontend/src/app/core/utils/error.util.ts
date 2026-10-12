import { HttpErrorResponse } from '@angular/common/http';
import { MESSAGES } from '../constants/message.constants';

/** Turns any HTTP error into one readable sentence for the user. */
export function getErrorMessage(error: unknown, fallback: string = MESSAGES.errors.generic): string {
  if (!(error instanceof HttpErrorResponse)) return fallback;
  if (error.status === 403) return MESSAGES.errors.readOnly;
  if (error.status === 503) return MESSAGES.errors.unavailable;
  if (error.status === 404) return error.error?.detail ?? MESSAGES.errors.notFound;
  return error.error?.detail ?? error.error?.title ?? fallback;
}
