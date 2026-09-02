import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/database/prisma.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../src/config/env.config';

jest.mock('../src/database/prisma.service', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn()
    },
    farmerProfile: {
      create: jest.fn()
    }
  }
}));

describe('Authentication & User Management APIs (Phase 1)', () => {
  const app = createApp();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should validate request body and reject invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: '123',
          name: 'R',
          role: 'FARMER'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should successfully register a new farmer and return tokens', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'usr-101',
        email: 'ramesh@farmer.com',
        name: 'Ramesh Murmu',
        role: 'FARMER',
        state: 'Odisha',
        district: 'Ganjam',
        isVerified: false,
        createdAt: new Date()
      });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'ramesh@farmer.com',
          password: 'securePassword123',
          name: 'Ramesh Murmu',
          role: 'FARMER',
          state: 'Odisha',
          district: 'Ganjam'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('ramesh@farmer.com');
      expect(res.body.data.tokens.accessToken).toBeDefined();
      expect(res.body.data.tokens.tokenType).toBe('Bearer');
    });

    it('should return 409 Conflict if email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-id',
        email: 'ramesh@farmer.com'
      });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'ramesh@farmer.com',
          password: 'securePassword123',
          name: 'Ramesh Murmu',
          role: 'FARMER'
        });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('USER_ALREADY_EXISTS');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should successfully authenticate user with correct credentials', async () => {
      const passwordHash = await bcrypt.hash('correctPassword', 10);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'usr-101',
        email: 'ramesh@farmer.com',
        name: 'Ramesh Murmu',
        passwordHash,
        role: 'FARMER',
        isVerified: true,
        createdAt: new Date()
      });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'ramesh@farmer.com',
          password: 'correctPassword'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('ramesh@farmer.com');
      expect(res.body.data.tokens.accessToken).toBeDefined();
    });

    it('should reject login with invalid password', async () => {
      const passwordHash = await bcrypt.hash('correctPassword', 10);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'usr-101',
        email: 'ramesh@farmer.com',
        name: 'Ramesh Murmu',
        passwordHash,
        role: 'FARMER'
      });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'ramesh@farmer.com',
          password: 'wrongPassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('GET /api/v1/auth/me (Protected Route & RBAC)', () => {
    it('should reject request without Bearer token with 401', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return authenticated user profile when valid token provided', async () => {
      const validToken = jwt.sign(
        { id: 'usr-101', email: 'ramesh@farmer.com', role: 'FARMER', name: 'Ramesh' },
        env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
      );

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'usr-101',
        email: 'ramesh@farmer.com',
        name: 'Ramesh Murmu',
        role: 'FARMER',
        farmerProfile: { id: 'fp-1', farmType: 'Paddy', crops: ['Rice'] }
      });

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('ramesh@farmer.com');
      expect(res.body.data.farmerProfile.farmType).toBe('Paddy');
    });
  });
});
