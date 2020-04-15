/**
 * messenger.module
 */

/* Node modules */

/* Third-party modules */
import { DynamicModule, Module, Provider } from '@nestjs/common';

/* Files */
import MessageController from '../controller/message.controller';
import MessengerService from './messenger.service';
import { createMessengerProvider, createMessengerTransportProvider } from './messenger.provider';
import { MESSENGER_MODULE_OPTS } from './messenger.constants';
import {
  IMessengerAsyncOpts,
  IMessengerOptions,
} from './messenger.interface';

@Module({
  providers: [
    MessengerService,
    createMessengerTransportProvider(),
  ],
  controllers: [MessageController],
  exports: [MessengerService],
})
export default class MessengerModule {
  static register(options: IMessengerOptions = {}) : DynamicModule {
    return {
      module: MessengerModule,
      providers: [
        ...createMessengerProvider(options),
      ],
    };
  }

  static registerAsync(options: IMessengerAsyncOpts = {}) : DynamicModule {
    return {
      module: MessengerModule,
      providers: this.createAsyncProvider(options),
    };
  }

  private static createAsyncProvider(opts: IMessengerAsyncOpts) : Provider[] {
    if (opts.useFactory) {
      return [{
        provide: MESSENGER_MODULE_OPTS,
        useFactory: opts.useFactory,
        inject: opts.inject || [],
      }];
    }

    return [];
  }
}
