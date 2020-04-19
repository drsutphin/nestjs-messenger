/**
 * health.module
 */

/* Node modules */

/* Third-party modules */
import { Module } from '@nestjs/common';

/* Files */
import HealthController from './health.controller';
import HealthService from './health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
})
export default class HealthModule {}
