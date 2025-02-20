import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/lib/utils/hash';
import { User } from '@prisma/client';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: string): Promise<User | NotFoundException> {
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
    if (!userCandidate) {
      throw new NotFoundException('User not found');
    }
    return userCandidate;
  }

  async getUserByEmail(email: string): Promise<User | NotFoundException> {
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
    if (!userCandidate) {
      throw new NotFoundException('User not found');
    }
    return userCandidate;
  }


  async createUser(dto: CreateUserDto): Promise<User | BadRequestException> {
    const isUserExist = await this.getUserByEmail(dto.email)
    if(isUserExist) throw new BadRequestException('Пользователь с таким email уже существует! ')
    const newUserCandidate = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashPassword(dto.password),
        name: dto.name,
        //@ts-ignore we have default value in db so we pass it even if it's undefined
        picture: dto.picture,
      },
    });
    return newUserCandidate;
  }
}
