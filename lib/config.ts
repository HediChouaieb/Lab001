// INTENTIONAL LAB VULNERABILITY — DO NOT USE IN PRODUCTION
// This configuration intentionally exposes secrets to the client bundle

export const publicConfig = {
  internalApi: 'http://localhost:3000/api/internal',
  environment: 'production',
  debug: true,
  testAdminEmail: 'admin@example.test',
  libraryApiKey: 'LAB-DEMO-KEY-2026',
  databaseHost: 'localhost',
  databasePort: 5432,
  appName: 'Carthage Library Lab',
  version: '1.0.0-lab',
};
