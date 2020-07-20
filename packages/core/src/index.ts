import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';
import snakeCase from 'lodash/snakeCase';
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

  configs: Config[] = [];

  constructor(
    config: Config | Config[] = defaultConfig as Config,
    options: Options = defaultOptions
  ) {
    if (Array.isArray(config)) {
      this.configs = config.map((config: Config) => {
        return {
          ...defaultConfig,
          ...config
        };
      });
    } else {
      this.configs.push({
        ...defaultConfig,
        ...config
      });
    }
    options = {
      ...defaultOptions,
      ...options,
      paths: {
        ...defaultOptions.paths,
        ...options.paths
      }
    };
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

  async run(): Promise<Doc[]> {
    return (
      await mapSeries(this.configs, async (config: Config) => {
        return this.runPipeline(config);
      })
    ).filter((doc: Doc | void) => typeof doc !== 'undefined') as Doc[];
  }

  async runPipeline(config: Config): Promise<Doc | void> {
    if (
      config.pipeline.length < 2 ||
      typeof config.pipeline[0] !== 'string' ||
      typeof config.pipeline[config.pipeline.length - 1] !== 'string'
    ) {
      return;
    }
    await fs.mkdirs(this.options.paths.tmp);
    let previousName = config.pipeline.shift() as string;
    const parent: Pipe | null = null;
    let doc = new Doc(path.resolve(config.rootPath, previousName), config.type);
    const to = config.pipeline.pop() as string;
    await mapSeries(config.pipeline, async (pipelineItem: PipelineItem) => {
      const plugin = getPlugin(
        typeof pipelineItem === 'string' ? pipelineItem : pipelineItem.name,
        typeof pipelineItem === 'string' ? {} : pipelineItem.config
      );
      if (!plugin?.pipe) return doc;
      const PluginPipe = plugin.pipe;
      const pipe = new PluginPipe(
        plugin.config,
        {
          ...this.options,
          paths: {
            ...this.options.paths,
            tmp: path.resolve(this.options.paths.tmp, plugin.name)
          }
        },
        parent
      );
      if (pipe.acceptedTypes && !pipe.acceptedTypes?.has(doc.type)) {
        throw new Error(`${snakeCase(pipe.constructor.name).replace(
          /_/g,
          ' '
        )} does not accept type ${doc.type}
try one of the following types ${[...pipe.acceptedTypes].join(', ')}`);
      }
      logger.info(`${previousName} -> ${plugin?.name}`);
      await fs.remove(pipe.paths.tmp);
      await fs.mkdirs(pipe.paths.tmp);
      doc = await pipe.pipe(doc);
      doc.rootPath = pipe.paths.tmp;
      if (pipe.toType) doc.type = pipe.toType;
      previousName = plugin.name;
      return doc;
    });
    const copyPipe = new CopyPipe({ to }, this.options, parent);
    logger.info(`${previousName} -> ${to}\n`);
    return copyPipe.pipe(doc);
  }
}

export { defaultConfig, defaultOptions, Doc, Pipe };
export * from './config';
export * from './doc';
export * from './pipe';
export * from './plugin';
export * from './types';
