import crypto from 'crypto';
import 'dotenv/config';

/**
 * Mask a secret (password or client_secret) using iRacing's OAuth2 masking algorithm.
 * The algorithm is: SHA-256(secret + normalized_identifier)
 * Where normalized_identifier is trimmed and lowercased.
 * 
 * @param secret - The secret to mask (password or client_secret)
 * @param identifier - The identifier (username for password, client_id for client_secret)
 * @returns Base64 encoded SHA-256 hash
 */
const maskSecret = (secret: string, identifier: string): string => {
  const normalizedId = identifier.trim().toLowerCase();
  return crypto
    .createHash('sha256')
    .update(`${secret}${normalizedId}`)
    .digest('base64');
};

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  scope?: string;
}

export class IRacingAuthClient {
  username: string;
  password: string;
  clientId: string;
  clientSecret: string;

  constructor(username: string, password: string, clientId: string, clientSecret: string) {
    this.username = username;
    this.password = password;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async generateToken(): Promise<string> {
    // Mask the password and client secret using iRacing's algorithm
    const maskedPassword = maskSecret(this.password, this.username);
    const maskedClientSecret = maskSecret(this.clientSecret, this.clientId);

    // Prepare form data for password_limited grant
    const formData = new URLSearchParams({
      grant_type: 'password_limited',
      client_id: this.clientId,
      client_secret: maskedClientSecret,
      username: this.username,
      password: maskedPassword,
      scope: 'iracing.auth',
    });

    const response = await fetch('https://oauth.iracing.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OAuth Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries()),
      });
      throw new Error(`Auth Error: ${response.status} ${response.statusText}`);
    }

    const tokenData: TokenResponse = await response.json();
    
    if (!tokenData.access_token) {
      throw new Error('Auth Error: No access token in response');
    }

    // Return the access token in Bearer format
    return `Bearer ${tokenData.access_token}`;
  }
}
