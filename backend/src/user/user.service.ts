import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/lib/utils/hash';
import { User } from '@prisma/client';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: string): Promise<User | null> {
    const userCandidate = await this.prisma.user.findUnique({
      include: {
        order: true,
        favorites: true,
        cart: true,
      },
      where: {
        id: id,
      },
    });
    return userCandidate;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const userCandidate = await this.prisma.user.findUnique({
      include: {
        order: true,
        favorites: true,
        cart: true,
      },
      where: {
        email: email,
      },
    });
    return userCandidate;
  }


  async createUser(dto: CreateUserDto): Promise<User> {
    try {
      const isUserExist = await this.getUserByEmail(dto.email);
      if (isUserExist) {
        throw new BadRequestException('User with this email already exists');
      }

      const newUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashPassword(dto.password),
          name: dto.name,
          picture: dto.picture || '/uploads/default-user-img.png',
        },
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }
}
