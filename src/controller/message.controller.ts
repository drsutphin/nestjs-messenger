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
import lodashSet from 'lodash.set';

/* Files */
import { MESSENGER_TRANSPORT } from '../lib/messenger.constants';
import { IMessengerTransports } from '../lib/messenger.interface';

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
      const { query } = req;

      /* Convert dot notation into objects */
      Object.keys(query)
        .forEach((key) => {
          lodashSet(query, key.split('.'), query[key]);
        });

      const output = await this.messengerTransports.emailTemplate.generate(template, query);

      return res.send(output);
    } catch (err) {
      return res.status(400)
        .send(err);
    }
  }
}
