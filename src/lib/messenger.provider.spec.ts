/**
 * messenger.provider.spec
 */

/* Node modules */

/* Third-party modules */
import { FactoryProvider } from '@nestjs/common';
import { createTransport } from 'nodemailer';

/* Files */
import { createMessengerProvider, createMessengerTransportProvider } from './messenger.provider';
import { MESSENGER_MODULE_OPTS, MESSENGER_TRANSPORT } from './messenger.constants';
import { IMessengerOptions } from './messenger.interface';
import MessageGenerator from './message.generator';
import PugGenerator from '../strategies/pug.strategy';
import HandlebarsGenerator from '../strategies/handlebars.strategy';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}));

jest.mock('./message.generator', () => jest.fn());
jest.mock('../strategies/pug.strategy', () => jest.fn());
jest.mock('../strategies/handlebars.strategy', () => jest.fn());

describe('Messenger provider', () => {
  describe('#createMessengerProvider', () => {
    it('should return the provider with an empty useValue', () => {
      expect(createMessengerProvider()).toEqual([{
        useValue: {},
        provide: MESSENGER_MODULE_OPTS,
      }]);
    });

    it('should return the provider with some useValue options set', () => {
      const opts = {
        hello: 'world',
      } as IMessengerOptions;

      expect(createMessengerProvider(opts)).toEqual([{
        useValue: opts,
        provide: MESSENGER_MODULE_OPTS,
      }]);
    });
  });

  describe('#createMessengerTransportProvider', () => {
    let provider: FactoryProvider<any>;
    beforeEach(() => {
      provider = createMessengerTransportProvider() as FactoryProvider<any>;
      expect(provider).toEqual(expect.objectContaining({
        provide: MESSENGER_TRANSPORT,
        inject: [MESSENGER_MODULE_OPTS],
      }));
    });

    it('should return an object with undefined objects if no config provided', async () => {
      expect(await provider.useFactory()).toEqual({});
    });

    describe('email', () => {
      let mockTransport: any;
      beforeEach(() => {
        mockTransport = {
          verify: jest.fn(),
        };

        (<any> createTransport).mockReturnValue(mockTransport);
      });

      it('should not call the verification if option set to false', async () => {
        const opts = {
          email: {
            verifyConnectionOnBoot: false,
            transport: {
              hello: 'world',
            },
          },
        } as IMessengerOptions;

        expect(await provider.useFactory(opts)).toEqual({
          emailTemplate: undefined,
          emailTransport: mockTransport,
        });

        expect(createTransport).toBeCalledWith(opts.email.transport);

        expect(mockTransport.verify).not.toBeCalled();
      });

      it('should call the verification if option set to true', async () => {
        const opts = {
          email: {
            verifyConnectionOnBoot: true,
            transport: {
              hello: 'world',
            },
          },
        } as IMessengerOptions;

        mockTransport.verify.mockResolvedValue(true);

        expect(await provider.useFactory(opts)).toEqual({
          emailTemplate: undefined,
          emailTransport: mockTransport,
        });

        expect(createTransport).toBeCalledWith(opts.email.transport);

        expect(mockTransport.verify).toBeCalled();
      });

      it('should configure the transport with no generator', async () => {
        const opts = {
          email: {
            transport: {
              hello: 'world',
            },
          },
        } as IMessengerOptions;

        mockTransport.verify.mockResolvedValue(true);

        expect(await provider.useFactory(opts)).toEqual({
          emailTemplate: undefined,
          emailTransport: mockTransport,
        });

        expect(createTransport).toBeCalledWith(opts.email.transport);

        expect(mockTransport.verify).toBeCalled();
      });

      it('should throw an error if the transport fails to verify', async () => {
        const opts = {
          email: {
            transport: {
              hello: 'world2',
            },
          },
        } as IMessengerOptions;

        mockTransport.verify.mockResolvedValue(false);

        try {
          await provider.useFactory(opts);

          throw new Error('invalid');
        } catch (err) {
          expect(err).toEqual(new Error('Messenger: nodemailer failed to verify'));
        }

        expect(createTransport).toBeCalledWith(opts.email.transport);

        expect(mockTransport.verify).toBeCalled();
      });

      it('should configure the transport with generator - pug', async () => {
        const opts = {
          email: {
            generator: {
              engine: 'pug',
              preview: true,
              templateDir: '/some/dir',
              useMjml: true,
              mjmlOpts: {
                opt1: 'value',
              },
            },
            transport: {
              hello: 'world',
            },
          },
        };

        mockTransport.verify.mockResolvedValue(true);

        const provideFactory = await provider.useFactory(opts);

        expect(provideFactory).toEqual(expect.objectContaining({
          emailTransport: mockTransport,
        }));

        expect(provideFactory.emailTemplate).toBeInstanceOf(MessageGenerator);

        expect(createTransport).toBeCalledWith(opts.email.transport);

        expect(MessageGenerator).toBeCalledWith({
          ...opts.email.generator,
          engine: PugGenerator.prototype,
        });

        expect(mockTransport.verify).toBeCalled();
      });

      it('should configure the transport with generator - handlebars', async () => {
        const opts = {
          email: {
            generator: {
              engine: 'handlebars',
              preview: true,
              templateDir: '/some/dir',
              useMjml: true,
              mjmlOpts: {
                opt1: 'value',
              },
            },
            transport: {
              hello: 'world',
            },
          },
        };

        mockTransport.verify.mockResolvedValue(true);

        const provideFactory = await provider.useFactory(opts);

        expect(provideFactory).toEqual(expect.objectContaining({
          emailTransport: mockTransport,
        }));

        expect(provideFactory.emailTemplate).toBeInstanceOf(MessageGenerator);

        expect(createTransport).toBeCalledWith(opts.email.transport);

        expect(MessageGenerator).toBeCalledWith({
          ...opts.email.generator,
          engine: HandlebarsGenerator.prototype,
        });

        expect(mockTransport.verify).toBeCalled();
      });

      it('should configure the transport with generator - strategy', async () => {
        const opts = {
          email: {
            generator: {
              engine: {
                compile: () => {},
              },
              preview: true,
              templateDir: '/some/dir',
              useMjml: true,
              mjmlOpts: {
                opt1: 'value',
              },
            },
            transport: {
              hello: 'world',
            },
          },
        };

        mockTransport.verify.mockResolvedValue(true);

        const provideFactory = await provider.useFactory(opts);

        expect(provideFactory).toEqual(expect.objectContaining({
          emailTransport: mockTransport,
        }));

        expect(provideFactory.emailTemplate).toBeInstanceOf(MessageGenerator);

        expect(createTransport).toBeCalledWith(opts.email.transport);

        expect(MessageGenerator).toBeCalledWith(opts.email.generator);

        expect(mockTransport.verify).toBeCalled();
      });
    });
  });
});
