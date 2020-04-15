/**
 * index.spec
 */

/* Node modules */

/* Third-party modules */

/* Files */
import * as index from './index';
import MessageGenerator from './lib/message.generator';
import MessengerModule from './lib/messenger.module';
import MessengerService from './lib/messenger.service';

describe('Index', () => {
  it('should expose all public classes and interfaces', () => {
    expect(index.MessageGenerator).toBe(MessageGenerator);
    expect(index.MessengerModule).toBe(MessengerModule);
    expect(index.MessengerService).toBe(MessengerService);
  });
});
