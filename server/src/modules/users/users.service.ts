import { prisma } from '../../database/prisma.service';
import { NotFoundError } from '../../common/errors/app.error';
import { UpdateProfileDto } from './users.dto';

export class UsersService {
  async getUserById(userId: string) {
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

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        phone: dto.phone,
        profileImage: dto.profileImage,
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
        profileImage: true,
        state: true,
        district: true,
        village: true,
        isVerified: true,
        updatedAt: true
      }
    });

    return user;
  }
}

export const usersService = new UsersService();
