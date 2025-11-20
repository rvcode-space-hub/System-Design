require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const logger = require('./config/logger');
const { sequelize } = require('./config/DB');
const errorHandler = require('./core/errors/errorHandler');

// Routers
const authRoutes = require('./router/userRouter');
const walletRoutes = require('./router/walletRouter');
const p2pRoutes = require('./router/p2pRoute');
const transactions = require('./router/transactionRouter');
const productProfilesRoutes = require('./router/productProfiles');
const serviceTypesRoutes = require('./router/serviceTypes');

const app = express();

// -----------------------------
// Middleware
// -----------------------------
app.use(express.json());

// Rate limiter: 120 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/p2p', p2pRoutes);
app.use('/api/transaction', transactions);
app.use('/api/product-profiles', productProfilesRoutes);
app.use('/api/service-types', serviceTypesRoutes);


app.use(errorHandler);


const PORT = process.env.PORT || 6060;

const startServer = async () => {
  try {
    // Test DB connection
    await sequelize.authenticate();
    logger.info('Database connected successfully');

    // Sync models (alter: false = no auto-changes)
    await sequelize.sync({ alter: false });
    logger.info('Database synchronized');

    // Start Express server
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (err) {
    logger.error(`Server failed to start: ${err.message}`, err);
    process.exit(1);
  }
};

startServer();
