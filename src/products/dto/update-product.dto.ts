import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsString()
  @IsOptional()
  public name?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  public price?: number;

  @IsNumber()
  @IsPositive()
  public id: number;
}
