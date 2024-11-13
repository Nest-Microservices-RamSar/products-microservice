import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  public page?: number = 1;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  public limit?: number = 10;

  @IsString()
  @IsOptional()
  public keyword?: string = '';
}
