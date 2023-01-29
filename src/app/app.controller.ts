import { Controller, Get } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { StatusDto, ProbeDto } from './dto'
import { BUILD_INFO } from '../config'

@Controller()
@ApiTags('Probes')
export class AppController {
  @Get('status')
  @ApiResponse({
    status: 200,
    description: 'Status endpoint',
    type: StatusDto,
  })
  getStatus() {
    return { status: 'OK', ...BUILD_INFO }
  }

  @Get('livenessProbe')
  @ApiResponse({
    status: 200,
    description: 'Liveness probe endpoint',
    type: ProbeDto,
  })
  livenessProbe() {
    return { time: Date.now() }
  }

  @Get('readinessProbe')
  @ApiResponse({
    status: 200,
    description: 'Readiness probe endpoint',
    type: ProbeDto,
  })
  readinessProbe() {
    return { time: Date.now() }
  }
}
