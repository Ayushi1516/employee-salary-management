/**
 * Development settings.
 * apiBaseUrl: where the browser sends "/api/..." calls. The gateway must allow CORS for http://localhost:4200.
 * Set it to '' to use the dev-server proxy (proxy.conf.json) instead.
 */
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080',
};
