/**
 * index
 */

/* Node modules */

/* Third-party modules */

/* Files */
import MessengerModule from './lib/messenger.module';
import MessageGenerator from './lib/message.generator';
import MessengerService from './lib/messenger.service';

export * from './lib/messenger.interface';
export {
  MessageGenerator,
  MessengerModule,
  MessengerService,
};
