// Custom built middleware
const logger = (req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()}: ${req.originalUrl}`);
  next();
};

module.exports = logger;
