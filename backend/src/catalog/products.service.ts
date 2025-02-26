import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { product } from "@prisma/client";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

}
