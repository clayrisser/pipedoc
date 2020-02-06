import path from 'path';
import Doc from './doc';
import defaultConfig from './defaultConfig';
import defaultOptions from './defaultOptions';
import { Config, Options, PipelineItem } from './types';
import { CopyPipe } from './pipes';
import { mapSeries } from './helpers';
// import { getPlugin } from './plugin';
// import { spawn } from './helpers';

export default class PipeDoc {
  constructor(
    public config: Config = defaultConfig as Config,
    public options: Options = defaultOptions
  ) {}

  async run(): Promise<Doc | null> {
    if (
      this.config.pipeline.length >= 2 &&
      typeof this.config.pipeline[0] === 'string' &&
      typeof this.config.pipeline[this.config.pipeline.length - 1] === 'string'
    ) {
      return null;
    }
    const doc = new Doc(
      path.resolve(
        this.config.rootPath,
        this.config.pipeline.shift() as string
      ),
      this.config.type
    );
    const to = this.config.pipeline.pop() as string;
    await mapSeries(
      this.config.pipeline,
      async (_pipelineItem: PipelineItem) => {
        return doc;
      }
    );
    const copyPipe = new CopyPipe({ to });
    return copyPipe.pipe(doc);
  }
}

export { defaultOptions };
export * from './config';
export * from './plugin';
export * from './types';
