import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/** Prefixes "/api/..." calls with the configured backend address (empty in production = same origin). */
export const apiUrlInterceptor: HttpInterceptorFn = (req, next) =>
  req.url.startsWith('/api/') && environment.apiBaseUrl
    ? next(req.clone({ url: environment.apiBaseUrl + req.url }))
    : next(req);
