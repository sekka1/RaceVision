import { authenticate } from '../authenticate';
import { IRacingAuthClient } from '../services/iracingAuthClient';

// Mock the IRacingAuthClient
jest.mock('../services/iracingAuthClient');

describe('authenticate', () => {
  const originalEnv = process.env;
  const mockGenerateToken = jest.fn();

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    mockGenerateToken.mockReset();

    // Mock the constructor to return an object with generateToken method
    (
      IRacingAuthClient as jest.MockedClass<typeof IRacingAuthClient>
    ).mockImplementation(
      () =>
        ({
          generateToken: mockGenerateToken,
          username: 'test@example.com',
          secret: 'test-secret',
          baseUrl: 'https://members-ng.iracing.com',
        }) as any,
    );
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should successfully authenticate with valid credentials', async () => {
    process.env.IRACING_USERNAME = 'test@example.com';
    process.env.IRACING_PASSWORD = 'password123';
    process.env.IRACING_CLIENT_ID = 'my_client_id';
    process.env.IRACING_CLIENT_SECRET = 'my_client_secret';

    const expectedToken = 'Bearer abc123';
    mockGenerateToken.mockResolvedValue(expectedToken);

    const token = await authenticate();

    expect(token).toBe(expectedToken);
    expect(IRacingAuthClient).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      'my_client_id',
      'my_client_secret',
    );
    expect(mockGenerateToken).toHaveBeenCalled();
  });

  it('should throw error when username is not defined', async () => {
    delete process.env.IRACING_USERNAME;
    process.env.IRACING_PASSWORD = 'password123';

    await expect(authenticate()).rejects.toThrow(
      'Auth Error: Invalid username or password',
    );
  });

  it('should throw error when password is not defined', async () => {
    process.env.IRACING_USERNAME = 'test@example.com';
    delete process.env.IRACING_PASSWORD;

    await expect(authenticate()).rejects.toThrow(
      'Auth Error: Invalid username or password',
    );
  });

  it('should throw error when both username and password are not defined', async () => {
    delete process.env.IRACING_USERNAME;
    delete process.env.IRACING_PASSWORD;

    await expect(authenticate()).rejects.toThrow(
      'Auth Error: Invalid username or password',
    );
  });

  it('should throw error when username is empty string', async () => {
    process.env.IRACING_USERNAME = '';
    process.env.IRACING_PASSWORD = 'password123';

    await expect(authenticate()).rejects.toThrow(
      'Auth Error: Invalid username or password',
    );
  });

  it('should throw error when password is empty string', async () => {
    process.env.IRACING_USERNAME = 'test@example.com';
    process.env.IRACING_PASSWORD = '';

    await expect(authenticate()).rejects.toThrow(
      'Auth Error: Invalid username or password',
    );
  });

  it('should propagate errors from IRacingAuthClient', async () => {
    process.env.IRACING_USERNAME = 'test@example.com';
    process.env.IRACING_PASSWORD = 'password123';
    process.env.IRACING_CLIENT_ID = 'my_client_id';
    process.env.IRACING_CLIENT_SECRET = 'my_client_secret';

    mockGenerateToken.mockRejectedValue(
      new Error('Auth Error: Unexpected auth error'),
    );

    await expect(authenticate()).rejects.toThrow(
      'Auth Error: Unexpected auth error',
    );
  });

  it('should handle network errors', async () => {
    process.env.IRACING_USERNAME = 'test@example.com';
    process.env.IRACING_PASSWORD = 'password123';
    process.env.IRACING_CLIENT_ID = 'my_client_id';
    process.env.IRACING_CLIENT_SECRET = 'my_client_secret';

    mockGenerateToken.mockRejectedValue(new Error('Network error'));

    await expect(authenticate()).rejects.toThrow('Network error');
  });
});
