let env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  process.env.PORT = 3000;
  process.env.HOST = '127.0.0.1';
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.HOST = '127.0.0.1';
}

module.exports = env;
