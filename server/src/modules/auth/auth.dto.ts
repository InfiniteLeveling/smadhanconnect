import { z } from 'zod';

export const RegisterDtoSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address format'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    role: z.enum(['FARMER', 'STUDENT', 'INDUSTRY', 'EXPERT', 'ADMIN']).default('FARMER'),
    state: z.string().optional(),
    district: z.string().optional(),
    village: z.string().optional()
  })
});

export const LoginDtoSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address format'),
    password: z.string().min(1, 'Password is required')
  })
});

export const RefreshTokenDtoSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
  })
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>['body'];
export type LoginDto = z.infer<typeof LoginDtoSchema>['body'];
export type RefreshTokenDto = z.infer<typeof RefreshTokenDtoSchema>['body'];
