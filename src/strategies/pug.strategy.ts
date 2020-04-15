/**
 * pug.strategy
 */

/* Node modules */
import * as path from 'path';

/* Third-party modules */
import { compileFile } from 'pug';

/* Files */
import {
  IKeyValue,
  IMessageGeneratorStrategy,
} from '..';

export default class PugGenerator implements IMessageGeneratorStrategy {
  async compile(basedir: string, template: string, params: IKeyValue) : Promise<string> {
    const filePath = path.join(basedir, `${template}.pug`);

    const compileFn = compileFile(filePath);

    return compileFn(params);
  }
}
