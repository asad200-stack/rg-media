import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateContentDto {
  @IsString()
  clientId!: string;

  @IsString()
  @MinLength(1)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  script?: string;

  @IsOptional()
  @IsString()
  referenceUrl?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsDateString()
  filmingDate?: string;

  @IsOptional()
  @IsString()
  shootStartTime?: string;

  @IsOptional()
  @IsDateString()
  publishingDate?: string;

  @IsOptional()
  @IsString()
  publishTime?: string;

  @IsOptional()
  @IsBoolean()
  shot?: boolean;

  @IsOptional()
  @IsBoolean()
  posted?: boolean;
}

export class UpdateContentDto {
  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  script?: string;

  @IsOptional()
  @IsString()
  referenceUrl?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsDateString()
  filmingDate?: string;

  @IsOptional()
  @IsString()
  shootStartTime?: string;

  @IsOptional()
  @IsDateString()
  publishingDate?: string;

  @IsOptional()
  @IsString()
  publishTime?: string;
}

export class ToggleDto {
  @IsBoolean()
  yes!: boolean;
}
