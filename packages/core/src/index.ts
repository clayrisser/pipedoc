import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';
import Doc from './doc';
import Pipe from './pipe';
import defaultConfig from './defaultConfig';
import defaultOptions from './defaultOptions';
import { Config, Options, Paths, PipelineItem } from './types';
import { CopyPipe } from './pipes';
import { getPlugin } from './plugin';
import { mapSeries } from './helpers';

const logger = console;
const rootPath = pkgDir.sync(process.cwd()) || process.cwd();

export default class PipeDoc {
  options: Options;

  constructor(
    public config: Config = defaultConfig as Config,
    options: Options = defaultOptions
  ) {
    options.paths.root = path.resolve(rootPath, options.paths.root);
    options.paths = {
      ...options.paths,
      ...((Object.entries(options.paths).reduce(
        (paths: { [key: string]: string }, [key, value]: [string, string]) => {
          if (key === 'root') return paths;
          paths[key] = path.resolve(options.paths.root, value);
          return paths;
        },
        {}
      ) as unknown) as Paths)
    };
    this.options = options;
  }

  async run(): Promise<Doc | null> {
    if (
      this.config.pipeline.length < 2 ||
      typeof this.config.pipeline[0] !== 'string' ||
      typeof this.config.pipeline[this.config.pipeline.length - 1] !== 'string'
    ) {
      return null;
    }
    await fs.mkdirs(this.options.paths.tmp);
    let previous = this.config.pipeline.shift() as string;
    const doc = new Doc(
      path.resolve(this.config.rootPath, previous),
      this.config.type
    );
    const to = this.config.pipeline.pop() as string;
    await mapSeries(
      this.config.pipeline,
      async (pipelineItem: PipelineItem) => {
        const plugin = getPlugin(
          typeof pipelineItem === 'string' ? pipelineItem : pipelineItem.name,
          typeof pipelineItem === 'string' ? {} : pipelineItem.config
        );
        if (!plugin?.pipe) return doc;
        const PluginPipe = plugin.pipe;
        const pipe = new PluginPipe(plugin.config, {
          ...this.options,
          paths: {
            ...this.options.paths,
            tmp: path.resolve(this.options.paths.tmp, plugin.name)
          }
        });
        logger.info(`${previous} -> ${plugin?.name}`);
        await fs.remove(path.resolve(this.options.paths.tmp, plugin.name));
        await fs.mkdirs(path.resolve(this.options.paths.tmp, plugin.name));
        const result = await pipe.pipe(doc);
        previous = plugin.name;
        return result;
      }
    );
    const copyPipe = new CopyPipe({ to }, this.options);
    logger.info(`${previous} -> ${to}`);
    return copyPipe.pipe(doc);
  }
}

export { defaultConfig, defaultOptions, Doc, Pipe };
export * from './config';
export * from './doc';
export * from './pipe';
export * from './plugin';
export * from './types';
