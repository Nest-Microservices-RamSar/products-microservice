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

  @IsNumber()
  @IsPositive()
  @Min(0)
  @Type(() => Number)
  public offset?: number = 0;

  @IsString()
  @IsOptional()
  public keyword?: string = '';

  @IsString()
  @IsOptional()
  public sortBy?: string = 'updatedAt';

  @IsString()
  @IsOptional()
  public sortOrder?: 'ASC' | 'DESC' = 'DESC';

  // Multiple values to sort
  @IsString({ each: true })
  @IsOptional()
  public sortFields?: string[];
}
