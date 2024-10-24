import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log(`Database connected!👌`);
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalItems = await this.product.count();
    const totalPages = Math.ceil(totalItems / limit);
    const lastPage = totalPages > 0 ? totalPages : 1;

    if (page > lastPage) {
      throw new Error('Page not found');
    }

    return {
      meta: {
        page,
        limit,
        totalPages,
        totalItems,
        lastPage,
      },
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
