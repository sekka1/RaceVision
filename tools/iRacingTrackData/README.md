# iRacing Track Data Tools

This directory contains tools for downloading and processing track data from the iRacing API.

## Prerequisites

### OAuth2 Client Registration

This tool requires OAuth2 credentials from iRacing. To get started:

1. **Register your application** by contacting iRacing support at: https://oauth.iracing.com/oauth2/book/client_registration.html
   
2. **Request a "password_limited" client type** - This is designed for automated/headless data access. Include in your request:
   - Client Name: (e.g., "My iRacing Track Data Tool")
   - Client Type: `server-side/password_limited`
   - Developer Email: (your email address associated with your iRacing account)
   - Audiences: `data-server`

3. **Wait for approval** - Registration requests may take up to 10 days to be processed.

4. **Receive credentials** - iRacing will provide you with:
   - `client_id`
   - `client_secret`

5. **Update your .env file** with the OAuth2 credentials:
   ```
   IRACING_USERNAME=your_email@example.com
   IRACING_PASSWORD=your_password
   IRACING_CLIENT_ID=your_client_id_here
   IRACING_CLIENT_SECRET=your_client_secret_here
   IRACING_BASE_URL=https://members-ng.iracing.com
   ```

### Authentication Flow

The tool uses the OAuth2 "Password Limited Grant" flow:

1. Your password and client secret are masked using SHA-256 hashing
2. A POST request is sent to `https://oauth.iracing.com/oauth2/token` with the `password_limited` grant type
3. An access token is returned and used for subsequent API requests
4. The access token is used in Bearer authentication format

**Note:** This grant type has strict rate limiting. Expect calls to take 2+ seconds. Use the refresh token for subsequent requests when possible.

## Authentication Testing

The authentication module includes comprehensive unit tests to ensure the authentication logic works correctly before deploying changes.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

The test suite covers:

1. **IRacingAuthClient** (`services/__tests__/iracingAuthClient.test.ts`)
   - Constructor and password encryption
   - Token generation with valid credentials
   - Error handling for various HTTP status codes (405, 401, 500)
   - Missing or invalid response headers
   - Network errors
   - Password hashing consistency

2. **authenticate function** (`__tests__/authenticate.test.ts`)
   - Successful authentication flow
   - Missing or empty environment variables
   - Error propagation from IRacingAuthClient
   - Network error handling

### Authentication Flow (OAuth2)

1. Environment variables must be set:
   - `IRACING_USERNAME` - Your iRacing email address
   - `IRACING_PASSWORD` - Your iRacing password
   - `IRACING_CLIENT_ID` - OAuth2 client ID (from iRacing registration)
   - `IRACING_CLIENT_SECRET` - OAuth2 client secret (from iRacing registration)
   - `IRACING_BASE_URL` - iRacing API base URL (https://members-ng.iracing.com)
2. The password is masked using SHA-256: `hash(password + normalized_username)`
3. The client secret is masked using SHA-256: `hash(client_secret + normalized_client_id)`
4. A POST request is sent to `https://oauth.iracing.com/oauth2/token` with `password_limited` grant
5. An access token is returned and used for subsequent API requests in Bearer format

### Common Errors

- **Missing OAuth2 credentials**: You need to register your application with iRacing first
- **401 Unauthorized**: Invalid username/password or client credentials
- **400 Bad Request with unauthorized_client**: Rate limit exceeded - wait before retrying
- **401 Unauthorized**: Invalid credentials
- **Missing Response Header**: The response doesn't include the expected Set-Cookie headers
- **Base URL not defined**: The `IRACING_BASE_URL` environment variable is not set

### CI/CD Integration

Tests are automatically run in the PR build workflow to ensure authentication logic is working before merging changes.

## Development

When making changes to the authentication logic:

1. Update the relevant source files
2. Run the tests to ensure nothing breaks
3. Add new test cases if adding new functionality
4. Run linting: `npm run lint`
5. Commit your changes

The PR build will automatically run tests to verify your changes.
