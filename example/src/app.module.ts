import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import HealthModule  from './health/health.module';
import { MessengerModule, IMessengerOptions } from '../../src';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          email: {
            generator: {
              preview: true,
              engine: 'pug',
              templateDir: path.join(__dirname, 'emailTemplates', 'pug'),
            },
            transport: {
              host: 'smtp.ethereal.email',
              port: 587,
              secure: false,
              auth: {
                // Generate at https://ethereal.email/
                user: 'tyrique.reichert@ethereal.email',
                pass: 'YNpjFwkX2ZzH5fBvp3',
              },
            },
          },
        }),
      ],
    }),
    // Use this if you want an asynchronously configured example
    MessengerModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) : Promise<IMessengerOptions> => ({
        email: config.get('email'),
      }),
    }),
    // Use this if you want a synchronously configured example
    // MessengerModule.register({
    //   email: {
    //     generator: {
    //       preview: true,
    //       engine: 'pug',
    //       // engine: 'handlebars',
    //       templateDir: path.join(__dirname, 'emailTemplates', 'pug'),
    //       // templateDir: path.join(__dirname, 'emailTemplates', 'handlebars'),
    //     },
    //     transport: {
    //       host: 'smtp.ethereal.email',
    //       port: 587,
    //       secure: false,
    //       auth: {
    //         // Generate at https://ethereal.email/
    //         user: '',
    //         pass: '',
    //       },
    //     },
    //   },
    // }),
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
