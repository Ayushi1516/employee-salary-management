import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '@env/environment';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { AuthService } from '../services/auth.service';
import { apiUrlInterceptor } from './api-url.interceptor';
import { authInterceptor } from './auth.interceptor';

describe('HTTP interceptors', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;

  beforeEach(() => {
    sessionStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ token: 'abc', username: 'u', role: 'HR_ADMIN' }));
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(withInterceptors([apiUrlInterceptor, authInterceptor])), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
  });
  afterEach(() => sessionStorage.clear());

  it('prefixes /api calls with the configured base URL and adds the bearer token', () => {
    http.get('/api/employees').subscribe();

    const req = ctrl.expectOne(environment.apiBaseUrl + '/api/employees');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc');
  });

  it('does not attach the token to the login call', () => {
    http.post('/api/auth/login', {}).subscribe();

    const req = ctrl.expectOne(environment.apiBaseUrl + '/api/auth/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
  });

  it('signs the user out when the API answers 401', () => {
    const auth = TestBed.inject(AuthService);
    jest.spyOn(auth, 'logout').mockImplementation(() => undefined);

    http.get('/api/employees').subscribe({ error: () => undefined });
    ctrl.expectOne(environment.apiBaseUrl + '/api/employees').flush('', { status: 401, statusText: 'Unauthorized' });

    expect(auth.logout).toHaveBeenCalled();
  });
});
