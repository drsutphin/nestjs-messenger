/**
 * messenger.service.spec
 */

/* Node modules */

/* Third-party modules */

/* Files */

import MessengerService from './messenger.service';

describe('Messenger service', () => {
  describe('#sendEmail', () => {
    let messenger: MessengerService;
    let messengerTransports: any;
    beforeEach(() => {
      messengerTransports = {
        emailTransport: {
          sendMail: jest.fn()
            .mockResolvedValue(true),
        },
      };
      messenger = new MessengerService(messengerTransports);
    });

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
});
