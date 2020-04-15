/**
 * message.generator
 */

/* Node modules */

/* Third-party modules */
import mjml2html from 'mjml';

/* Files */
import {
  IKeyValue,
  IMessageGenerator,
  IMessageGeneratorConfig,
} from './messenger.interface';

export default class MessageGenerator implements IMessageGenerator {
  constructor(private readonly config: IMessageGeneratorConfig) {}

  async generate(template: string, params: IKeyValue) : Promise<string> {
    /* Generate the template */
    const compiledTemplate = await this.config.engine
      .compile(this.config.templateDir, template, params);

    if (this.config.useMjml === false) {
      /* Don't compile through MJML */
      return compiledTemplate;
    }

    const { html } = mjml2html(compiledTemplate, {
      /* Default values */
      keepComments: false,
      beautify: true,
      minify: false,
      validationLevel: 'strict',
      /* Override with user config */
      ...this.config.mjmlOpts,
    });

    return html;
  }

  previewEnabled(): boolean {
    return this.config.preview ?? false;
  }
}
