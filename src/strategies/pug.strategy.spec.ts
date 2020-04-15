/**
 * pug.strategy.spec
 */

/* Node modules */
import * as path from 'path';

/* Third-party modules */
import { compileFile } from 'pug';

/* Files */
import PugGenerator from './pug.strategy';

jest.mock('pug', () => ({
  compileFile: jest.fn(),
}));

describe('Pug strategy', () => {
  describe('#compile', () => {
    it('should compile the pug template', async () => {
      const generator = new PugGenerator();

      const basedir = '/base';
      const template = 'template';
      const params = {
        hello: 'world',
      };

      const result = 'output';

      const compileFn = jest.fn()
        .mockReturnValue(result);

      (<any> compileFile).mockReturnValue(compileFn);

      expect(await generator.compile(basedir, template, params)).toEqual(result);

      expect(compileFile).toBeCalledWith(path.join(basedir, `${template}.pug`));

      expect(compileFn).toBeCalledWith(params);
    });
  });
});
