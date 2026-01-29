import 'dotenv/config';
import { IRacingAuthClient } from './services/iracingAuthClient';

export const authenticate = async (): Promise<string> => {
  const username = process.env.IRACING_USERNAME;
  const password = process.env.IRACING_PASSWORD;
  const clientId = process.env.IRACING_CLIENT_ID;
  const clientSecret = process.env.IRACING_CLIENT_SECRET;

  if (!username || !password) {
    throw new Error('Auth Error: Invalid username or password');
  }

  if (!clientId || !clientSecret) {
    throw new Error(
      'Auth Error: Missing IRACING_CLIENT_ID or IRACING_CLIENT_SECRET. Please register your application at https://oauth.iracing.com/oauth2/book/client_registration.html',
    );
  }

  const authToken = await new IRacingAuthClient(
    username,
    password,
    clientId,
    clientSecret,
  ).generateToken();

  console.info('iRacing API auth successful');

  return authToken;
};
