import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { sendError } from '../common-utils/send-error';
import { sendResponse } from '../common-utils/send-response';
import { CUSTOM_ERROR_MESSAGES } from '../types/custom-error-messages';
import { google } from 'googleapis';
import axios, { AxiosResponse } from 'axios';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import { validateRequest } from '../common-utils/schema-validation';

// Load environment variables from .env file
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'defaultSecretKey';

// Google Authentication Flow
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CLIENT_REDIRECT_URL, // server redirect url handler
);

export function creteAuthLink(req: Request, res: Response) {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/calendar',
      ],
      prompt: 'consent',
    });
    res.send({ url });
  } catch (error) {
    sendError(res, 500, CUSTOM_ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}

export async function handleGoogleRedirect(req: Request, res: Response) {
  try {
    // get code from url
    const code = req.query.code as string;
    // get access token
    oauth2Client.getToken(code, (err, tokens: any) => {
      if (err) {
        throw new Error('Issue with Login');
      }
      const accessToken = tokens.access_token;
      const refreshToken = tokens.refresh_token;

      res.redirect(
        `http://localhost:3000/sign-up-or-login?accessToken=${accessToken}&refreshToken=${refreshToken}`,
      );
    });
  } catch (error) {
    sendError(res, 500, CUSTOM_ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}

export async function getValidToken(req: Request, res: Response) {
  try {
    const response: AxiosResponse<any> = await axios.post(
      'https://www.googleapis.com/oauth2/v4/token',
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: req.body.refreshToken,
        grant_type: 'refresh_token',
      },
    );

    const data: any = response.data;

    sendResponse(res, 200, 'Successfully login to the system', {
      accessToken: data.access_token,
    });
  } catch (error) {
    sendError(res, 500, CUSTOM_ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}

const userSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 8 },
  },
  required: ['email', 'password'],
};

// SignUp and Login Flow
export async function signUpOrLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    // Check if the user with the provided email already exists
    let user = await userService.findUserByEmail(email);

    if (user) {
      // User already exists, perform login
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        return sendError(res, 401, CUSTOM_ERROR_MESSAGES.INVALID_CREDENTIAL);
      }
    } else {
      // Validate the request body against the schema
      const validationErrors = validateRequest(userSchema, req.body);
      if (validationErrors) {
        return sendError(res, 400, JSON.stringify(validationErrors));
      }
      // User does not exist, perform sign-up
      user = await userService.createNewUser({ email, password });
    }

    // Create a JWT payload
    const payload = { id: user.id, email: user.email };

    // Generate a JWT token
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });
    return sendResponse(res, 200, 'Successfully login to the system', {
      token,
    });
  } catch (error) {
    console.error('Error in sign-up or login:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
