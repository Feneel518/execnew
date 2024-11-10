import { ConnectionOptions, DefaultJobOptions } from "bullmq";
import Redis from "ioredis";

export const redisConnection: ConnectionOptions = new Redis(
  process.env.UPSTASH_REDIS_URL!,
  {
    tls: { rejectUnauthorized: false }, // Necessary for Upstash Redis
    maxRetriesPerRequest: null,
  }
);
export const defaultQueueOptions: DefaultJobOptions = {
  removeOnComplete: {
    count: 10,
    age: 60 * 60,
  },
  attempts: 3,
  removeOnFail: false,
  backoff: {
    type: "exponential",
    delay: 3000,
  },
};
