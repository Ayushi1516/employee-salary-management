import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_ENDPOINTS } from '../constants/api.constants';
import { EmployeeService } from './employee.service';

describe('EmployeeService.search', () => {
  let http: HttpTestingController;
  let service: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(EmployeeService);
  });

  it('sends only the filters that have a value, trimmed', () => {
    service.search({ q: '  ada ', departmentId: 3, countryCode: '', page: 2 }).subscribe();

    const req = http.expectOne((r) => r.url === API_ENDPOINTS.employees.base);
    expect(req.request.params.get('q')).toBe('ada');
    expect(req.request.params.get('departmentId')).toBe('3');
    expect(req.request.params.has('countryCode')).toBe(false);
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('size')).toBe('25');
  });
});
