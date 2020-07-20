import fs from 'fs-extra';
import globby from 'globby';
import path from 'path';
import pkgDir from 'pkg-dir';
import Doc from './doc';
import Pipe, { PipeConfig } from './pipe';
import defaultConfig from './defaultConfig';
import defaultOptions from './defaultOptions';
import { Config, Options, Paths, PipelineItem, Plugin } from './types';
import { CopyPipe } from './pipes';
import { difference } from './set';
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

  async run(): Promise<string[][]> {
    return (
      await mapSeries(this.configs, async (config: Config) => {
        return this.runPipeline(config);
      })
    ).filter(
      (convertedFilePaths: string[] | void) =>
        typeof convertedFilePaths !== 'undefined'
    ) as string[][];
  }

  async runPipeline(config: Config): Promise<string[] | void> {
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
    let doc = new Doc(path.resolve(config.rootPath, previousName));
    const to = config.pipeline.pop() as string;
    await mapSeries(config.pipeline, async (pipelineItem: PipelineItem) => {
      const plugin = getPlugin(
        typeof pipelineItem === 'string' ? pipelineItem : pipelineItem.name,
        typeof pipelineItem === 'string' ? {} : pipelineItem.config
      );
      if (!plugin) return;
      const pipe = this.createPipe(plugin, parent);
      if (!pipe) return;
      const result = await this.runPipelineItem(
        previousName,
        doc,
        plugin,
        pipe
      );
      doc.rootPath = pipe.paths.tmp;
      previousName = plugin.name;
      return result;
    });
    const copyPipe = new CopyPipe({ to }, this.options, parent);
    logger.info(`${previousName} -> ${to}\n`);
    return copyPipe.pipe(doc);
  }

  createPipe(plugin: Plugin<PipeConfig>, parent: Pipe | null): Pipe | void {
    if (!plugin.pipe) return;
    const PluginPipe = plugin.pipe;
    return new PluginPipe(
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
  }

  async runPipelineItem(
    previousName: string,
    doc: Doc,
    plugin: Plugin<PipeConfig>,
    pipe: Pipe
  ) {
    logger.info(`${previousName} -> ${plugin?.name}`);
    await fs.remove(pipe.paths.tmp);
    await fs.mkdirs(pipe.paths.tmp);
    const filePaths = new Set(await globby(`${doc.rootPath}/${doc.glob}`));
    const convertedFilePaths = new Set(await pipe.pipe(doc));
    const ignorePaths =
      pipe.ignoreGlobs?.reduce(
        (ignorePaths: Set<string>, ignoreGlob: string) => {
          return new Set([
            ...ignorePaths,
            ...globby.sync(`${doc.rootPath}/${ignoreGlob}`)
          ]);
        },
        new Set()
      ) || new Set();
    const unconvertedFilePaths = difference(
      difference(filePaths, ignorePaths),
      convertedFilePaths
    );
    await Promise.all(
      [...unconvertedFilePaths].map(async (filePath: string) => {
        const fileName = filePath.substr(doc.rootPath.length + 1);
        await fs.copyFile(filePath, path.resolve(pipe.paths.tmp, fileName));
      })
    );
    return doc;
  }
}

export { defaultConfig, defaultOptions, Doc, Pipe };
export * from './config';
export * from './doc';
export * from './helpers';
export * from './pipe';
export * from './plugin';
export * from './set';
export * from './types';
