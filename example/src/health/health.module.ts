/**
 * health.module
 */

/* Node modules */

/* Third-party modules */
import { Module } from '@nestjs/common';

/* Files */
import HealthController from './health.controller';

@Module({
  controllers: [HealthController],
})
export default class HealthModule {}
