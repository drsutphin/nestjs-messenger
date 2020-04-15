/**
 * message.controller.spec
 */

/* Node modules */

/* Third-party modules */

/* Files */
import MessageController from './message.controller';
import { IMessengerTransports } from '..';

describe('Message controller', () => {
  let transport: IMessengerTransports;
  let controller: MessageController;

  beforeEach(async () => {
    transport = {
      emailTemplate: {
        previewEnabled: jest.fn(),
        generate: jest.fn(),
      },
    };
    controller = new MessageController(transport);
  });

  describe('#previewMessage', () => {
    it('should return 404 if emailTemplate not configured', async () => {
      controller = new MessageController({});

      const req = {
        method: 'GET',
        url: 'invalid-url',
      };
      const res = {
        status: jest.fn(),
        send: jest.fn(),
      };
      res.status.mockReturnValue(res);

      await controller.previewMessage('template', req, res);

      expect(res.status).toBeCalledWith(404);
      expect(res.send).toBeCalledWith({
        statusCode: 404,
        message: `Cannot ${req.method} ${req.url}`,
        error: 'Not Found',
      });
    });

    it('should return 404 if the preview is not enabled', async () => {
      (<any> transport).emailTemplate.previewEnabled
        .mockReturnValue(false);

      const req = {
        method: 'METHOD',
        url: 'some-url',
      };
      const res = {
        status: jest.fn(),
        send: jest.fn(),
      };
      res.status.mockReturnValue(res);

      await controller.previewMessage('template', req, res);

      expect(res.status).toBeCalledWith(404);
      expect(res.send).toBeCalledWith({
        statusCode: 404,
        message: `Cannot ${req.method} ${req.url}`,
        error: 'Not Found',
      });
    });

    it('should display the preview page', async () => {
      const output = 'some-output';
      (<any> transport).emailTemplate.previewEnabled
        .mockReturnValue(true);
      (<any> transport).emailTemplate.generate
        .mockResolvedValue(output);

      const req = {
        method: 'METHOD',
        url: 'some-url',
        query: {
          hello: 'world',
        },
      };
      const res = {
        send: jest.fn(),
      };

      const template = 'templateName';

      await controller.previewMessage(template, req, res);

      expect(transport.emailTemplate.generate).toBeCalledWith(template, req.query);
      expect(res.send).toBeCalledWith(output);
    });

    it('should handle an error in the preview page', async () => {
      const err = new Error('some-error');
      (<any> transport).emailTemplate.previewEnabled
        .mockReturnValue(true);
      (<any> transport).emailTemplate.generate
        .mockRejectedValue(err);

      const req = {
        method: 'METHOD',
        url: 'some-url',
        query: {
          hello: 'world',
        },
      };
      const res = {
        status: jest.fn(),
        send: jest.fn(),
      };
      res.status.mockReturnValue(res);

      const template = 'templateName2';

      await controller.previewMessage(template, req, res);

      expect(transport.emailTemplate.generate).toBeCalledWith(template, req.query);
      expect(res.status).toBeCalledWith(400);
      expect(res.send).toBeCalledWith(err);
    });
  });
});
