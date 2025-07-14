import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import problemRoutes from './routes/problem.routes.js';
import executionRoutes from './routes/executeCode.routes.js';
import submissionRoutes from './routes/submission.routes.js';
import playlistRoutes from './routes/playlist.routes.js';

dotenv.config();
const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/', () => {
  console.log(`Hello Welcome to DexCode 🔪🩸`);
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/problem', problemRoutes);
app.use('/api/v1/execute-code', executionRoutes);
app.use('/api/v1/submission', submissionRoutes);
app.use('/api/v1/playlist', playlistRoutes);

// Global error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || [],
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on 8080`);
});
