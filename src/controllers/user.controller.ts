import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { verifyGoogleToken } from '../common-utils/verify-google-token';
import { sendError } from '../common-utils/send-error';
import { sendResponse } from '../common-utils/send-response';
import { CUSTOM_ERROR_MESSAGES } from '../types/custom-error-messages';

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
    sendError(res, 500, CUSTOM_ERROR_MESSAGES.CREDENTIAL_INVALID);
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
    sendError(res, 500, CUSTOM_ERROR_MESSAGES.CREDENTIAL_INVALID);
  }
}
