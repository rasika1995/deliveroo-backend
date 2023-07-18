import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { verifyGoogleToken } from '../common-utils/verify-google-token';
import { sendError } from '../common-utils/send-error';
import { sendResponse } from '../common-utils/send-response';
import { CUSTOM_ERROR_MESSAGES } from '../types/custom-error-messages';
import { google } from 'googleapis';
import axios, { AxiosResponse } from 'axios';

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

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
    console.log('code', code);
    // get access token
    oauth2Client.getToken(code, (err, tokens: any) => {
      if (err) {
        console.log('error', err);
        throw new Error('Issue with Login');
      }
      const accessToken = tokens.access_token;
      const refreshToken = tokens.refresh_token;

      console.log('accessToken', accessToken);
      console.log('refreshToken', refreshToken);

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
    console.log('data', data.access_token);

    res.json({
      accessToken: data.access_token,
    });
  } catch (error) {
    console.log(error);
    sendError(res, 500, CUSTOM_ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}

export async function signUp(req: Request, res: Response) {
  try {
    if (req.body.credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);
      if (verificationResponse.error) {
        return sendError(res, 400, verificationResponse.error);
      }

      const profile = verificationResponse?.payload;
      if (profile) {
        const name = `${profile?.name}`;
        const email = `${profile?.email}`;
        const user = await userService.findUserByEmail(email);
        if (user) {
          return sendResponse(
            res,
            200,
            'User already sign-up to the system',
            user,
          );
        }
        const cretedUser = await userService.createNewUser(name, email);
        sendResponse(res, 201, 'Successfully register the user', cretedUser);
      } else {
        sendError(res, 400, CUSTOM_ERROR_MESSAGES.CREDENTIAL_INVALID);
      }
    } else {
      sendError(res, 400, CUSTOM_ERROR_MESSAGES.CREDENTIAL_INVALID);
    }
  } catch (error) {
    sendError(res, 500, CUSTOM_ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}

export async function login(req: Request, res: Response) {
  try {
    if (req.body.credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);
      if (verificationResponse.error) {
        return sendError(res, 400, verificationResponse.error);
      }

      const profile = verificationResponse?.payload;
      if (profile) {
        const email = `${profile?.email}`;
        const user = await userService.findUserByEmail(email);
        if (user) {
          return sendResponse(
            res,
            200,
            'Successfully log-in to the system',
            user,
          );
        }
        sendError(res, 400, 'Please sign-up to the system');
      } else {
        sendError(res, 400, CUSTOM_ERROR_MESSAGES.CREDENTIAL_INVALID);
      }
    } else {
      sendError(res, 400, CUSTOM_ERROR_MESSAGES.CREDENTIAL_INVALID);
    }
  } catch (error) {
    sendError(res, 500, CUSTOM_ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}
