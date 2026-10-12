import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { authGuard, guestGuard } from './auth.guard';

describe('route guards', () => {
  const run = (guard: typeof authGuard) =>
    TestBed.runInInjectionContext(() => guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient()] });
  });
  afterEach(() => sessionStorage.clear());

  it('authGuard sends anonymous users to /login', () => {
    const result = run(authGuard);
    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/login');
  });

  it('authGuard lets signed-in users through', () => {
    sessionStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ token: 't', username: 'u', role: 'HR_VIEWER' }));
    expect(run(authGuard)).toBe(true);
  });

  it('guestGuard sends signed-in users to the dashboard', () => {
    sessionStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ token: 't', username: 'u', role: 'HR_VIEWER' }));
    const result = run(guestGuard);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/dashboard');
  });
});
