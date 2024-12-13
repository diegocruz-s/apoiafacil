import 'dotenv/config'
export const ConfigRedis = {
  host: 'redis_container',
  port: 6379,
  password: process.env.REDIS_PASSWORD,
};