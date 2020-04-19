/**
 * health.service
 */

/* Node modules */

/* Third-party modules */
import { Inject, Injectable } from '@nestjs/common';
import { IMessengerTransports, MESSENGER_TRANSPORT } from '../../../src';

/* Files */

@Injectable()
export default class HealthService {
  constructor(@Inject(MESSENGER_TRANSPORT) private readonly messengerTransports: IMessengerTransports) {}

  send() {
    console.log(this.messengerTransports);
  }
}
