/**
 * messenger.service
 */

/* Node modules */

/* Third-party modules */
import { Inject, Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

/* Files */
import { MESSENGER_TRANSPORT } from './messenger.constants';
import {
  IMessageSendOpts,
  IMessengerTransports,
} from './messenger.interface';

@Injectable()
export default class MessengerService {
  constructor(
    @Inject(MESSENGER_TRANSPORT) private readonly messengerTransports: IMessengerTransports,
  ) {}

  async sendEmail(opts: Mail.Options, message?: IMessageSendOpts) : Promise<SentMessageInfo> {
    if (!this.messengerTransports.emailTransport) {
      throw new Error('Email transport not configured');
    }

    if (message) {
      opts.html = await this.messengerTransports.emailTemplate
        .generate(message.template, message.params || {});
    }

    return this.messengerTransports.emailTransport.sendMail(opts);
  }
}
