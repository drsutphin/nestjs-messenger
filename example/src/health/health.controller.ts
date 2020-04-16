/**
 * health.controller
 */

/* Node modules */

/* Third-party modules */
import { Controller, Get } from '@nestjs/common';

/* Files */
import { MessengerService } from '../../../src';

@Controller('/health')
export default class HealthController {
  constructor(
    protected messageService: MessengerService,
  ) {}

  @Get('/')
  async healthCheck() {
    return {
      verify: await this.messageService.verifyEmail(),
    };
  }
}
