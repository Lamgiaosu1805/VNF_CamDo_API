const Redis = require("ioredis");

const redis = new Redis({
    host: "127.0.0.1", // Địa chỉ Redis server
    port: 6379, // Cổng Redis (mặc định)
  });
  
  redis.on("connect", () => console.log("🔗 Kết nối Redis thành công!"));
  redis.on("error", (err) => console.error("❌ Lỗi Redis:", err));
  
  module.exports = redis;