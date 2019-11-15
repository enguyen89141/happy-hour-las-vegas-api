module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL || 'postgresql://dunder_mifflin:dunder@localhost/happy-hour-las-vegas',
    TEST_DB_URL: process.env.TEST_DB_URL || 'postgresql://dunder_mifflin:dunder@localhost/happy-hour-las-vegas-test',
    JWT_SECRET: process.env.JWT_SECRET || 'developer-middle-name-hoang',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '10m'
  }