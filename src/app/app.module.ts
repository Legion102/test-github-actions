import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import { RewardsModule } from '../modules/services/rewards-service/rewards.module'

@Module({
  imports: [
    RewardsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [],
})
export class ApplicationModule {}
