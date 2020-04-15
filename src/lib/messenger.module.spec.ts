/**
 * messenger.module.spec
 */

/* Node modules */

/* Third-party modules */

/* Files */
import MessengerModule from './messenger.module';
import { createMessengerProvider } from './messenger.provider';
import { IMessengerOptions } from './messenger.interface';
import { MESSENGER_MODULE_OPTS } from './messenger.constants';

jest.mock('./messenger.provider', () => ({
  createMessengerProvider: jest.fn(),
  createMessengerTransportProvider: jest.fn(),
}));

describe('Messenger module', () => {
  describe('Static methods', () => {
    describe('#register', () => {
      it('should register an instance of the module with no options', () => {
        const providers = [];
        (<any> createMessengerProvider).mockReturnValue(providers);

        expect(MessengerModule.register()).toEqual({
          providers,
          module: MessengerModule,
        });

        expect(createMessengerProvider).toBeCalledWith({});
      });

      it('should register an instance of the module with some options', () => {
        const providers = [
          'provider1',
          'provider2',
        ];
        (<any> createMessengerProvider).mockReturnValue(providers);

        const opts = {
          hello: 'world',
        } as IMessengerOptions;

        expect(MessengerModule.register(opts)).toEqual({
          providers,
          module: MessengerModule,
        });

        expect(createMessengerProvider).toBeCalledWith(opts);
      });
    });

    describe('#registerAsync', () => {
      it('should register an instance with no options', () => {
        expect(MessengerModule.registerAsync()).toEqual({
          providers: [],
          module: MessengerModule,
        });
      });

      it('should register an instance with some useFactory options and no injects', () => {
        const opts = {
          useFactory: jest.fn(),
        };

        expect(MessengerModule.registerAsync(opts)).toEqual({
          providers: [{
            provide: MESSENGER_MODULE_OPTS,
            useFactory: opts.useFactory,
            inject: [],
          }],
          module: MessengerModule,
        });
      });

      it('should register an instance with some useFactory options and some injects', () => {
        const opts = {
          useFactory: jest.fn(),
          inject: [
            'some injector',
          ],
        };

        expect(MessengerModule.registerAsync(opts)).toEqual({
          providers: [{
            provide: MESSENGER_MODULE_OPTS,
            useFactory: opts.useFactory,
            inject: opts.inject,
          }],
          module: MessengerModule,
        });
      });
    });
  });
});
