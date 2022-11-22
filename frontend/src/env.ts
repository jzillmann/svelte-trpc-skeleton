export const devMode = import.meta.env.DEV;
export const servedOnLocalhost =
  location.hostname === 'localhost' || location.hostname === '127.0.0.1';

console.log(`Running in ${devMode ? 'dev' : 'production'} mode on ${location.hostname}`);
