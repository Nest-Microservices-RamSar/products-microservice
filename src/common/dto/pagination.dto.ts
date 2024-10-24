import { Type } from 'class-transformer';
import { IsNumber, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  public page?: number = 1;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  public limit?: number = 10;
}
