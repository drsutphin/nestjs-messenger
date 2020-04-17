/**
 * messenger.interface
 */

/* Node modules */

/* Third-party modules */
import { ModuleMetadata } from '@nestjs/common/interfaces';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as SMTPPool from 'nodemailer/lib/smtp-pool';
import * as StreamTransport from 'nodemailer/lib/stream-transport';
import * as SendmailTransport from 'nodemailer/lib/sendmail-transport';
import * as SESTransport from 'nodemailer/lib/ses-transport';
import Mail from 'nodemailer/lib/mailer';

/* Files */

export interface MJMLMinifyOptions {
  collapseWhitespace?: boolean;
  minifyCSS?: boolean;
  removeEmptyAttributes?: boolean;
}

export interface MJMLParsingOpts {
  fonts?: { [key: string]: string; };
  keepComments?: boolean;
  beautify?: boolean;
  minify?: boolean;
  validationLevel?: 'strict' | 'soft' | 'skip';
  filePath?: string;
  minifyOptions?: MJMLMinifyOptions;
}

export interface IKeyValue {
  [key: string]: any;
}

export interface IMessageGeneratorStrategy {
  compile(dir: string, template: string, params: IKeyValue): Promise<string>;
}

export interface IMessageGenerator {
  generate(template: string, params: IKeyValue): Promise<string>;
  previewEnabled(): boolean;
}

export interface IMessageSendOpts {
  template: string;
  params?: IKeyValue;
}

export interface IMessageGeneratorConfig extends IMessageGeneratorOpts {
  engine: IMessageGeneratorStrategy;
}

export interface IMessageGeneratorOpts {
  engine: 'pug' | 'handlebars' | IMessageGeneratorStrategy;
  preview?: boolean;
  templateDir: string;
  useMjml?: boolean;
  mjmlOpts?: MJMLParsingOpts
}

export interface IMessengerOptions {
  email?: {
    generator?: IMessageGeneratorOpts;
    transport: TransportOptionsStatic;
    verifyConnectionOnBoot?: boolean;
  };
}

export type TransportOptionsStatic = SMTPTransport
| SMTPTransport.Options
| SMTPPool
| SMTPPool.Options
| StreamTransport
| StreamTransport.Options
| SendmailTransport
| SendmailTransport.Options
| SESTransport
| SESTransport.Options;

export interface IMessengerAsyncOpts extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<IMessengerOptions> | IMessengerOptions;
  inject?: any[];
}

export interface IMessengerTransports {
  emailTemplate?: IMessageGenerator;
  emailTransport?: Mail;
}
