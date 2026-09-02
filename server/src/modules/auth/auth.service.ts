import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../database/prisma.service';
import { env } from '../../config/env.config';
import { RegisterDto, LoginDto } from './auth.dto';
import { 
  ConflictError, 
  UnauthorizedError, 
  NotFoundError 
} from '../../common/errors/app.error';
import { ErrorCode } from '../../common/errors/error-codes';
import { Role } from '@prisma/client';

export class AuthService {
  /**
   * Register a new user and automatically initialize their associated role profile.
   */
  async register(dto: RegisterDto) {
    const existingUser = await prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists', ErrorCode.USER_ALREADY_EXISTS);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        name: dto.name,
        role: dto.role as Role,
        state: dto.state,
        district: dto.district,
        village: dto.village
      },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        state: true,
        district: true,
        village: true,
        isVerified: true,
        createdAt: true
      }
    });

    // Auto-create role-specific profile stub
    await this.initializeRoleProfile(user.id, user.role);

    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    return { user, tokens };
  }

  /**
   * Authenticate user with credentials and issue access/refresh token pair.
   */
  async login(dto: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password', ErrorCode.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password', ErrorCode.INVALID_CREDENTIALS);
    }

    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    const sanitizedUser = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role,
      state: user.state,
      district: user.district,
      village: user.village,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    };

    return { user: sanitizedUser, tokens };
  }

  /**
   * Refresh JWT token pair.
   */
  async refresh(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
        id: string;
        email: string;
        role: Role;
        name: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      const tokens = this.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      });

      return tokens;
    } catch (err: any) {
      throw new UnauthorizedError('Invalid or expired refresh token', ErrorCode.INVALID_TOKEN);
    }
  }

  /**
   * Get current authenticated user profile along with role-specific details.
   */
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        profileImage: true,
        state: true,
        district: true,
        village: true,
        isVerified: true,
        createdAt: true,
        farmerProfile: true,
        studentProfile: true,
        industryProfile: true,
        mentorProfile: true
      }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  private generateTokens(payload: { id: string; email: string; role: Role; name: string }) {
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as any
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: env.JWT_ACCESS_EXPIRES_IN
    };
  }

  private async initializeRoleProfile(userId: string, role: Role) {
    try {
      if (role === Role.FARMER) {
        await prisma.farmerProfile.create({ data: { userId } });
      } else if (role === Role.STUDENT) {
        await prisma.studentProfile.create({ data: { userId } });
      } else if (role === Role.INDUSTRY) {
        await prisma.industryProfile.create({
          data: {
            userId,
            companyName: 'Individual/Organization',
            industry: 'Agriculture/Tech'
          }
        });
      } else if (role === Role.EXPERT) {
        await prisma.mentorProfile.create({ data: { userId } });
      }
    } catch (err) {
      console.warn('Profile stub creation note:', (err as Error).message);
    }
  }
}

export const authService = new AuthService();
