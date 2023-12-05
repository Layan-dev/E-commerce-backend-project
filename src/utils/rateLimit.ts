import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 7,
  message: "You've reached the request limit. Try again later",
})
