/**
 * message.generator.spec
 */

/* Node modules */

/* Third-party modules */
import mjml2html from 'mjml';

/* Files */
import MessageGenerator from './message.generator';

jest.mock('mjml', () => jest.fn());

describe('Message generator', () => {
  describe('#generate', () => {
    let engine;

    beforeEach(() => {
      engine = {
        compile: jest.fn(),
      };
    });

    it('should compile the template and not compile through MJML', async () => {
      const compiled = 'some compiled template';

      engine.compile.mockResolvedValue(compiled);
      const template = 'templateName';
      const params = {
        hello: 'world',
      };
      const templateDir = 'templateDir';

      const generator = new MessageGenerator({
        engine,
        templateDir,
        useMjml: false,
      });

      expect(await generator.generate(template, params)).toEqual(compiled);

      expect(engine.compile).toBeCalledWith(templateDir, template, params);
    });

    it('should compile the template and compile through MJML - use default options', async () => {
      const mjmlCompiled = 'some mjml output';

      (<any> mjml2html).mockReturnValue({
        html: mjmlCompiled,
      });

      const compiled = 'some mjml compiled template';

      engine.compile.mockResolvedValue(compiled);
      const template = 'templateName2';
      const params = {
        hello2: 'world2',
      };
      const templateDir = 'templateDir2';

      const generator = new MessageGenerator({
        engine,
        templateDir,
      });

      expect(await generator.generate(template, params)).toEqual(mjmlCompiled);

      expect(engine.compile).toBeCalledWith(templateDir, template, params);
      expect(mjml2html).toBeCalledWith(compiled, {
        keepComments: false,
        beautify: true,
        minify: false,
        validationLevel: 'strict',
      });
    });

    it('should compile the template and compile through MJML - use configured options', async () => {
      const mjmlCompiled = 'some mjml output2';

      (<any> mjml2html).mockReturnValue({
        html: mjmlCompiled,
      });

      const compiled = 'some mjml2 compiled template';

      engine.compile.mockResolvedValue(compiled);
      const template = 'templateName3';
      const params = {
        hello2: 'world3',
      };
      const templateDir = 'templateDir3';

      const generator = new MessageGenerator({
        engine,
        templateDir,
        useMjml: true,
        mjmlOpts: {
          keepComments: true,
          beautify: false,
          minify: true,
          validationLevel: 'skip',
        },
      });

      expect(await generator.generate(template, params)).toEqual(mjmlCompiled);

      expect(engine.compile).toBeCalledWith(templateDir, template, params);
      expect(mjml2html).toBeCalledWith(compiled, {
        keepComments: true,
        beautify: false,
        minify: true,
        validationLevel: 'skip',
      });
    });
  });

  describe('#previewEnabled', () => {
    it('should return true if preview set to true', () => {
      const generator = new MessageGenerator({
        preview: true,
      } as any);

      expect(generator.previewEnabled()).toBe(true);
    });

    it('should return false if preview set to false', () => {
      const generator = new MessageGenerator({
        preview: false,
      } as any);

      expect(generator.previewEnabled()).toBe(false);
    });

    it('should return false if preview not', () => {
      const generator = new MessageGenerator({} as any);

      expect(generator.previewEnabled()).toBe(false);
    });
  });
});
