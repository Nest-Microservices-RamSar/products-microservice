import { Type } from 'class-transformer';
import { IsNumber, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  public page?: number = 1;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  public limit?: number = 10;
}
