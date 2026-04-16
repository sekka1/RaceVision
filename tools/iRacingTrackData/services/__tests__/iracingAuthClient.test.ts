import { IRacingAuthClient } from '../iracingAuthClient';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

describe('IRacingAuthClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    mockFetch.mockReset();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('constructor', () => {
    it('should create an instance with all four credentials', () => {
      const client = new IRacingAuthClient(
        'test@example.com',
        'password123',
        'my_client_id',
        'my_client_secret',
      );
      expect(client.username).toBe('test@example.com');
      expect(client.password).toBe('password123');
      expect(client.clientId).toBe('my_client_id');
      expect(client.clientSecret).toBe('my_client_secret');
    });
  });

  describe('generateToken', () => {
    it('should successfully generate a Bearer token with valid credentials', async () => {
      const mockResponse = {
        ok: true,
        text: jest.fn().mockResolvedValue(''),
        json: jest.fn().mockResolvedValue({ access_token: 'abc123' }),
        headers: { entries: jest.fn().mockReturnValue([]) },
      };

      mockFetch.mockResolvedValue(mockResponse);

      const client = new IRacingAuthClient(
        'test@example.com',
        'password123',
        'my_client_id',
        'my_client_secret',
      );
      const token = await client.generateToken();

      expect(token).toBe('Bearer abc123');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://oauth.iracing.com/oauth2/token',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      );
    });

    it('should throw error when response is not ok (405 Not Allowed)', async () => {
      const mockResponse = {
        ok: false,
        status: 405,
        statusText: 'Not Allowed',
        text: jest.fn().mockResolvedValue('error body'),
        headers: { entries: jest.fn().mockReturnValue([]) },
      };

      mockFetch.mockResolvedValue(mockResponse);

      const client = new IRacingAuthClient(
        'test@example.com',
        'password123',
        'my_client_id',
        'my_client_secret',
      );

      await expect(client.generateToken()).rejects.toThrow(
        'Auth Error: 405 Not Allowed',
      );
    });

    it('should throw error when response is not ok (401 Unauthorized)', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: jest.fn().mockResolvedValue('error body'),
        headers: { entries: jest.fn().mockReturnValue([]) },
      };

      mockFetch.mockResolvedValue(mockResponse);

      const client = new IRacingAuthClient(
        'test@example.com',
        'password123',
        'my_client_id',
        'my_client_secret',
      );

      await expect(client.generateToken()).rejects.toThrow(
        'Auth Error: 401 Unauthorized',
      );
    });

    it('should throw error when access_token is missing from response', async () => {
      const mockResponse = {
        ok: true,
        text: jest.fn().mockResolvedValue(''),
        json: jest.fn().mockResolvedValue({}),
        headers: { entries: jest.fn().mockReturnValue([]) },
      };

      mockFetch.mockResolvedValue(mockResponse);

      const client = new IRacingAuthClient(
        'test@example.com',
        'password123',
        'my_client_id',
        'my_client_secret',
      );

      await expect(client.generateToken()).rejects.toThrow(
        'Auth Error: No access token in response',
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const client = new IRacingAuthClient(
        'test@example.com',
        'password123',
        'my_client_id',
        'my_client_secret',
      );

      await expect(client.generateToken()).rejects.toThrow('Network error');
    });
  });
});
