import { OAuth2Client, TokenPayload } from 'google-auth-library';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(
  token: string,
): Promise<{ payload?: TokenPayload; error?: string }> {
  console.log('GOOGLE_CLIENT_ID', GOOGLE_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    console.log('error', error);
    return { error: 'Invalid user detected. Please try again' };
  }
}
