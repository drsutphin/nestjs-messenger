/**
 * message.controller
 */

/* Node modules */

/* Third-party modules */
import {
  Controller,
  Get,
  Inject,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { MESSENGER_TRANSPORT } from '../lib/messenger.constants';
import { IMessengerTransports } from '../lib/messenger.interface';

/* Files */

@Controller('/message-preview')
export default class MessageController {
  constructor(
    @Inject(MESSENGER_TRANSPORT) private readonly messengerTransports: IMessengerTransports,
  ) {}

  @Get('/:template')
  async previewMessage(@Param('template') template: string, @Req() req, @Res() res) {
    if (!this.messengerTransports.emailTemplate?.previewEnabled()) {
      /* Throwing NotFoundException is caught as a 500 so define it fully */
      return res.status(404)
        .send({
          statusCode: 404,
          message: `Cannot ${req.method} ${req.url}`,
          error: 'Not Found',
        });
    }

    try {
      const output = await this.messengerTransports.emailTemplate.generate(template, req.query);

      return res.send(output);
    } catch (err) {
      return res.status(400)
        .send(err);
    }
  }
}
