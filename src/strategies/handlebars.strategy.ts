/**
 * handlebars.strategy
 */

/* Node modules */
import { promises as fs } from 'fs';
import * as path from 'path';
import util from 'util';

/* Third-party modules */
import glob from 'glob';
import * as Handlebars from 'handlebars';

/* Files */
import { IKeyValue, IMessageGeneratorStrategy } from '..';

export default class HandlebarsGenerator implements IMessageGeneratorStrategy {
  async compile(basedir: string, template: string, params: IKeyValue): Promise<string> {
    const partials = await HandlebarsGenerator.getPartials(basedir);

    partials.forEach(({ name, content }) => {
      Handlebars.registerPartial(name, content);
    });

    const filePath = path.join(basedir, `${template}.hbs`);
    const file = await HandlebarsGenerator.loadFile(filePath);
    const compileFn = Handlebars.compile(file);

    return compileFn(params);
  }

  static async getPartials(basedir: string) {
    const partialFiles = await util.promisify(glob)(path.join(basedir, 'partials', '**/*.hbs'));

    return Promise.all(partialFiles.map(async (partial) => {
      const content = await HandlebarsGenerator.loadFile(partial);

      const name = path.basename(partial, '.hbs');

      return {
        name,
        content,
      };
    }));
  }

  static loadFile(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf8');
  }
}
