/** Production settings: same origin. nginx proxies /api to the gateway, so no CORS is needed. */
export const environment = {
  production: true,
  apiBaseUrl: '',
};
