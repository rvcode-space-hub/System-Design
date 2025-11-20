const rateLimiters = new Map();
function rateLimiter(limit, windowMs) {
  return (req, res, next) => {
    const key = req.ip; 
    const now = Date.now();
    
    if (!rateLimiters.has(key)) {
      rateLimiters.set(key, []);
    }

    const timestamps = rateLimiters.get(key);

    while (timestamps.length && timestamps[0] <= now - windowMs) {
      timestamps.shift();
    }

    if (timestamps.length >= limit) {
      return res.status(429).json({
        error: `Rate limit exceeded. Try again in ${Math.ceil(
          (windowMs - (now - timestamps[0])) / 1000
        )} seconds.`,
      });
    }

    timestamps.push(now);
    rateLimiters.set(key, timestamps);
    next();
  };
}

module.exports = rateLimiter;
