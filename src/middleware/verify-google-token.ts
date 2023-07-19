import { Request, Response, NextFunction } from 'express';
import { sendError } from "../common-utils/send-error";
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_API_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_API_CLIENT_ID);

interface GooglePayload {
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;
    email: string;
  }

export async function verifyGoogleToken(googleToken: string, req: Request, res: Response, next: NextFunction){
  console.log("test", googleToken)
    try {
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: GOOGLE_API_CLIENT_ID,
      });
      console.log(ticket)
      const payload = ticket.getPayload() as GooglePayload;
      // req.user = payload;
      const now = Date.now() / 1000;
      if (payload.exp < now) {
        return sendError(res, 401,'Expired Google API token.' );
      }
      return next();
    } catch (error) {
        console.log(error)
        return sendError(res, 401,'Invalid Google API token.' );
    }
};
  