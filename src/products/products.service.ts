import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log(`Database connected!👌`);
  }

  create(createProductDto: CreateProductDto) {
    const product = this.product.create({
      data: createProductDto,
    });

    if (!product) {
      throw new RpcException({
        status: 401,
        message: 'Failed to create product',
      });
    }

    return product;
  }

  async findAll(paginationDto: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      offset = 0,
      keyword,
      sortBy = 'updatedAt',
      sortOrder = 'DESC',
      sortFields = [],
    } = paginationDto;

    // Calcular el skip en base a `page` y `limit` o usar el `offset`
    const skip = offset || (page - 1) * limit;

    // Obtener el conteo total de elementos activos
    const totalItems = await this.product.count({
      where: {
        isActive: true,
        ...(keyword && {
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
            // Agrega más campos de búsqueda según sea necesario
          ],
        }),
      },
    });
    const totalPages = Math.ceil(totalItems / limit);

    if (page > totalPages) {
      throw new RpcException({
        message: `Page not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    // Configuración de campos de ordenamiento
    const orderBy = sortFields.length
      ? sortFields.map((field) => ({ [field]: sortOrder }))
      : [{ [sortBy]: sortOrder }];

    // Consulta principal con paginación, filtros, búsqueda y ordenamiento
    const data = await this.product.findMany({
      skip,
      take: limit,
      where: {
        isActive: true,
        ...(keyword && {
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            // Agrega más campos de búsqueda según sea necesario
            // { description: { contains: keyword, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy,
    });

    // Respuesta con los datos y la metadata de paginación
    return {
      meta: {
        page,
        limit,
        totalPages,
        totalItems,
      },
      data,
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
      throw new RpcException({
        message: `Product with ID: #${id} not found.`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _, ...data } = updateProductDto;

    await this.findOne(id);

    return await this.product.update({
      where: {
        id,
      },
      data: data,
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

  async validateProducts(productIds: number[]) {
    productIds = [...new Set(productIds)];

    const products = await this.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (productIds.length !== products.length) {
      throw new RpcException({
        message: 'Some products were not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return products;
  }
}
