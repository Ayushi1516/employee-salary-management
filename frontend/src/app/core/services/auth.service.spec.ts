import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { API_ENDPOINTS } from '../constants/api.constants';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });

  function login(auth: AuthService, role: string): void {
    auth.login('user', 'pw').subscribe();
    http.expectOne(API_ENDPOINTS.auth.login).flush({ token: 't', username: 'user', role, expiresInSeconds: 60 });
  }

  it('stores the session after login', () => {
    const auth = TestBed.inject(AuthService);
    login(auth, 'HR_ADMIN');

    expect(auth.isAuthenticated()).toBe(true);
    expect(auth.token).toBe('t');
    expect(sessionStorage.getItem(STORAGE_KEYS.session)).toContain('HR_ADMIN');
  });

  it('only an HR admin is "admin"', () => {
    const auth = TestBed.inject(AuthService);
    login(auth, 'HR_VIEWER');

    expect(auth.isAdmin()).toBe(false);
    expect(auth.hasAnyRole(['HR_VIEWER'])).toBe(true);
    expect(auth.hasAnyRole(['HR_ADMIN'])).toBe(false);
  });

  it('logout clears the session', () => {
    const auth = TestBed.inject(AuthService);
    login(auth, 'HR_ADMIN');

    auth.logout(false);

    expect(auth.isAuthenticated()).toBe(false);
    expect(sessionStorage.getItem(STORAGE_KEYS.session)).toBeNull();
  });

  it('ignores corrupt stored data', () => {
    sessionStorage.setItem(STORAGE_KEYS.session, '{not json');
    expect(TestBed.inject(AuthService).isAuthenticated()).toBe(false);
  });
});
