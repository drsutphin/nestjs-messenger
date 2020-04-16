/**
 * messenger.service.spec
 */

/* Node modules */

/* Third-party modules */

/* Files */

import MessengerService from './messenger.service';

describe('Messenger service', () => {
  let messenger: MessengerService;
  let messengerTransports: any;
  beforeEach(() => {
    messengerTransports = {
      emailTransport: {
        sendMail: jest.fn()
          .mockResolvedValue(true),
        verify: jest.fn(),
      },
    };
    messenger = new MessengerService(messengerTransports);
  });

  describe('#emailIsConfigured', () => {
    it('should return false if email not configured', () => {
      messenger = new MessengerService({});

      expect(messenger.emailIsConfigured()).toBe(false);
    });
    it('should return true if email configured', () => {
      expect(messenger.emailIsConfigured()).toBe(true);
    });
  });

  describe('#sendEmail', () => {
    it('should error if no email transport configured', async () => {
      messenger = new MessengerService({});

      try {
        await messenger.sendEmail({});

        throw new Error('invalid');
      } catch (err) {
        expect(err).toEqual(new Error('Email transport not configured'));
      }
    });

    it('should generate the HTML if a message is present and then send', async () => {
      const opts = {
        to: 'toAddress',
      } as any;

      const html = 'htmlTemplate';
      messengerTransports.emailTemplate = {
        generate: jest.fn()
          .mockResolvedValue(html),
      };

      const template = 'template name';

      expect(await messenger.sendEmail(opts, {
        template,
      })).toBe(true);

      expect(messengerTransports.emailTemplate.generate).toBeCalledWith(template, {});

      expect(messengerTransports.emailTransport.sendMail).toBeCalledWith({
        html,
        to: 'toAddress',
      });
    });

    it('should generate the HTML if a message is present with params and then send', async () => {
      const opts = {
        to: 'toAddress',
      } as any;

      const html = 'htmlTemplate';
      messengerTransports.emailTemplate = {
        generate: jest.fn()
          .mockResolvedValue(html),
      };

      const template = 'template name';
      const params = {
        some: 'params',
      };

      expect(await messenger.sendEmail(opts, {
        template,
        params,
      })).toBe(true);

      expect(messengerTransports.emailTemplate.generate).toBeCalledWith(template, params);

      expect(messengerTransports.emailTransport.sendMail).toBeCalledWith({
        html,
        to: 'toAddress',
      });
    });

    it('should send a message if no message passed', async () => {
      const opts = {
        hello: 'world',
      } as any;

      expect(await messenger.sendEmail(opts)).toBe(true);

      expect(messengerTransports.emailTransport.sendMail).toBeCalledWith(opts);
    });
  });

  describe('#verifyEmailConnection', () => {
    it('should error if no email transport configured', async () => {
      messenger = new MessengerService({});

      try {
        await messenger.verifyEmailConnection();

        throw new Error('invalid');
      } catch (err) {
        expect(err).toEqual(new Error('Email transport not configured'));

        expect(messengerTransports.emailTransport.verify).not.toBeCalled();
      }
    });

    it('should return false from the verification and then throw error', async () => {
      messengerTransports.emailTransport.verify.mockResolvedValue(false);

      try {
        await messenger.verifyEmailConnection();

        throw new Error('invalid');
      } catch (err) {
        expect(err).toEqual(new Error('Unable to verify email transport connection'));

        expect(messengerTransports.emailTransport.verify).toBeCalledWith();
      }
    });

    it('should return true if verification succeeds', async () => {
      messengerTransports.emailTransport.verify.mockResolvedValue(true);

      expect(await messenger.verifyEmailConnection()).toBe(true);

      expect(messengerTransports.emailTransport.verify).toBeCalledWith();
    });
  });
});
