import { ApiProperty } from '@nestjs/swagger'

export class ProbeDto {
  @ApiProperty({ example: '2021-03-01T10:49:26.132Z' })
    time: string

  @ApiProperty({ example: 1022586 })
    height: number
}
