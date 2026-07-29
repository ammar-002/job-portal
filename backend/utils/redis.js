import Redis from 'ioredis';

const redis =  new Redis(process.env.REDIS_URL, {
    tls: {
        rejectUnauthorized: false
    },
    maxRetriesPerRequest: 3,
});
// console.log(process.env.REDIS_URL);

redis.on('connect',()=>{
    console.log('Redis connected successfully');
})


redis.on('error',(err)=>{
    console.log('Redis connection error:', err);
})
export default redis;
