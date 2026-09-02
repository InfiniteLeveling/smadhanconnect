import { z } from 'zod';

export const UpdateProfileDtoSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
    profileImage: z.string().url().optional(),
    state: z.string().optional(),
    district: z.string().optional(),
    village: z.string().optional()
  })
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileDtoSchema>['body'];
