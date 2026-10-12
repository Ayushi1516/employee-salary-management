import { HttpErrorResponse } from '@angular/common/http';
import { MESSAGES } from '../constants/message.constants';
import { getErrorMessage } from './error.util';

describe('getErrorMessage', () => {
  it('explains a 403 as a read-only role', () => {
    expect(getErrorMessage(new HttpErrorResponse({ status: 403 }))).toBe(MESSAGES.errors.readOnly);
  });

  it('prefers the API problem detail', () => {
    const error = new HttpErrorResponse({ status: 400, error: { detail: 'email invalid' } });
    expect(getErrorMessage(error)).toBe('email invalid');
  });

  it('falls back for unknown errors', () => {
    expect(getErrorMessage(new Error('boom'))).toBe(MESSAGES.errors.generic);
  });
});
