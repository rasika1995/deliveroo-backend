import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyGoogleToken } from './verify-google-token';
import { sendError } from '../common-utils/send-error';
import { CUSTOM_ERROR_MESSAGES } from '../types/custom-error-messages';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'defaultSecretKey';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Check if the request contains a token
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  // Check the x-auth-type header to differentiate between Google and JWT tokens
  const authType = req.header('x-auth-type');

  if (authType === 'google') {
    // Google API token verification
    await verifyGoogleToken(token, req, res, next);
  } else if (authType === 'jwt') {
    // JWT token verification
    try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY) as any;
      // req.user = decoded.user;
      return next();
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError') {
        return sendError(res, 401, 'Invalid JWT token.');
      }
      return sendError(res, 500, CUSTOM_ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  } else {
    return sendError(res, 400, 'Invalid Token type');
  }
}

export default authMiddleware;
