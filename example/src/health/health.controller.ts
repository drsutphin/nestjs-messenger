/**
 * health.controller
 */

/* Node modules */

/* Third-party modules */
import { Controller, Get } from '@nestjs/common';

/* Files */
import HealthService from './health.service';
import { MessengerService } from '../../../src';

@Controller('/health')
export default class HealthController {
  constructor(
    protected service: HealthService,
    protected messageService: MessengerService,
  ) {}

  @Get('/')
  async healthCheck() {
    console.log(this.service.send());

    return {
      verify: await this.messageService.verifyEmailConnection(),
    };
  }
}
