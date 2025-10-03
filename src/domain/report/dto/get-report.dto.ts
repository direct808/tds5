import { ArrayMinSize, IsArray, IsString } from 'class-validator'

export class GetReportDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  declare metrics: string[]
}
