import {
  IsString,
  IsEnum,
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
  IsNumber,
  Min,
  MaxLength,
  Max,
} from 'class-validator';
import { Category } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  @MaxLength(127)
  title: string;

  @IsEnum(Category)
  category: Category;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @IsString({ each: true })
  imageUrls: string[];

  @IsNumber()
  @Min(0)
  @Max(999_999_999)
  price: number;

  @IsString()
  @MaxLength(8191)
  description: string;
}
