import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
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

    const totalItems = await this.product.count({
      where: {
        isActive: true,
      },
    });
    const totalPages = Math.ceil(totalItems / limit);
    const lastPage = totalPages > 0 ? totalPages : 1;

    if (page > lastPage) {
      throw new NotFoundException('Page not found');
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
        where: {
          isActive: true,
        },
      }),
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: {
        id,
        isActive: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID: #${id} not found.`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return await this.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.product.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }

  async hardDelete(id: number) {
    return this.product.delete({
      where: { id },
    });
  }
}
