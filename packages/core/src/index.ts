import fs from 'fs-extra';
import globby from 'globby';
import highwayhash from 'highwayhash';
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
const hashKeyBuffer = Buffer.from(
  Array.apply(null, new Array(32)).map(
    (_item: any, i: number) => process.cwd().charCodeAt(i) || 0
  )
);

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
    const hash = highwayhash.asHexString(
      hashKeyBuffer,
      Buffer.from(JSON.stringify(config))
    );
    const tmpPath = path.resolve(this.options.paths.tmp, hash);
    await fs.mkdirs(tmpPath);
    let previousName = config.pipeline.shift() as string;
    const parent: Pipe | null = null;
    let doc = new Doc(path.resolve(config.rootPath, previousName));
    const to = config.pipeline.pop() as string;
    const genesisPath = path.resolve(tmpPath, 'copy');
    const genesisCopyPipe = new CopyPipe(
      { to: genesisPath },
      this.options,
      parent
    );
    await genesisCopyPipe.pipe(doc);
    doc.rootPath = genesisPath;
    await mapSeries(config.pipeline, async (pipelineItem: PipelineItem) => {
      const plugin = getPlugin(
        typeof pipelineItem === 'string' ? pipelineItem : pipelineItem.name,
        typeof pipelineItem === 'string' ? {} : pipelineItem.config
      );
      if (!plugin) return;
      const pipe = this.createPipe(plugin, parent, tmpPath);
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
    const finishCopyPipe = new CopyPipe({ to }, this.options, parent);
    logger.info(`${previousName} -> ${to}\n`);
    return finishCopyPipe.pipe(doc);
  }

  createPipe(
    plugin: Plugin<PipeConfig>,
    parent: Pipe | null,
    tmpPath: string
  ): Pipe | void {
    if (!plugin.pipe) return;
    const PluginPipe = plugin.pipe;
    return new PluginPipe(
      plugin.config,
      {
        ...this.options,
        paths: {
          ...this.options.paths,
          tmp: path.resolve(tmpPath, plugin.name)
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
        try {
          await fs.mkdirp(
            path.resolve(pipe.paths.tmp, fileName).replace(/[^\/]+$/g, '')
          );
          await fs.copyFile(filePath, path.resolve(pipe.paths.tmp, fileName));
        } catch (err) {
          console.error(err);
        }
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
