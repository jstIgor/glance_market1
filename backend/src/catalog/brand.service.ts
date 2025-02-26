import { Injectable } from "@nestjs/common";
import { brand } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  async getBrands(): Promise<brand[]> {
    return this.prisma.brand.findMany({
      include: {
        ProductFamily: {
          include: {
            subCategory: {
              include: {
                categories: true // если нужны все поля
              }
            }
          }
        }
      }
    });
  }
}
