const fs = require('fs');

const type = process.env.TYPEORM_TYPE || 'postgres';
const username = process.env.TYPEORM_USERNAME || 'postgres';
const password = process.env.TYPEORM_PASSWORD || '9592';
const host = process.env.TYPEORM_HOST || 'localhost';
const port = parseInt(process.env.TYPEORM_PORT, 10) || 5432;
const database = process.env.TYPEORM_DATABASE || 'bug_tracker';

// Read CA cert from environment variable
const caCertPath = process.env.db.CA_CERT;
let caCert;

if (caCertPath) {
  try {
    caCert = fs.readFileSync(caCertPath).toString();
  } catch (err) {
    console.error(`Failed to read CA certificate at ${caCertPath}:`, err);
    // Handle error appropriately (e.g., exit or fallback)
  }
}

module.exports = {
  type,
  url:
    process.env.DATABASE_URL ||
    `${type}://${username}:${password}@${host}:${port}/${database}`,
  entities: [
    process.env.NODE_ENV === 'test'
      ? 'src/entity/**/*.ts'
      : 'build/entity/**/*.js',
  ],
  migrations: [
    process.env.NODE_ENV === 'test'
      ? 'src/migration/**/*.ts'
      : 'build/migration/**/*.js',
  ],
  cli: {
    entitiesDir:
      process.env.NODE_ENV === 'test' ? 'src/entity' : 'build/entity',
    migrationsDir:
      process.env.NODE_ENV === 'test' ? 'src/migration' : 'build/migration',
  },
  synchronize: false,
  logging: false,
  extra: {
    ssl: {
      rejectUnauthorized: false, // Disables SSL cert validation
      ca: caCert,                 // Use CA cert from environment variable if available
    },
  },
};