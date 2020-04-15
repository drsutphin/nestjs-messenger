import { Injectable } from '@nestjs/common';
import { MessengerService } from '../../src';

@Injectable()
export class AppService {
  constructor(
    private readonly messengerService: MessengerService,
  ) {}

  async getHello(): Promise<string> {
    const a = await this.messengerService.sendEmail({
      from: 'noreply@testsender.com',
      to: 'Test Receiver <test@receiver.com>',
      subject: 'Test email',
    }, {
      template: 'test',
      params: {
        name: 'First name',
      },
    });
    // const a = '@todo';

    // const a = await this.messengerService.sendEmail({
    //   from: 'Simon Emms <simon.emms@gmail.com>',
    //   to: 'Test Receiver <simon@simonemms.com>',
    //   subject: 'test email2',
    //   text: 'text',
    //   html: '<b>html</b>',
    // });

    console.log({
      a,
    });

    return 'Hello World!';
  }
}
