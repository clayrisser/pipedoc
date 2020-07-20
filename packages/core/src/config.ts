import path from 'path';
import pkgDir from 'pkg-dir';
import { cosmiconfigSync } from 'cosmiconfig';
import defaultConfig from './defaultConfig';
import { Config, PipelineItem } from './types';

const rootPath = pkgDir.sync(process.cwd()) || process.cwd();
let _config: Config[];

export function getUserConfig(): Partial<Config> {
  let userConfig: Partial<Config> = {};
  try {
    const payload = cosmiconfigSync('pipedoc').search(rootPath);
    // TODO
    userConfig = (payload && payload.config ? payload.config : {}) as Partial<
      Config
    >;
  } catch (err) {
    if (err.name !== 'YAMLException') throw err;
    // eslint-disable-next-line import/no-dynamic-require,global-require,no-eval
    userConfig = eval(`require(${err.mark.name})`);
  }
  return userConfig;
}

export function loadConfig() {
  if (_config) return _config;
  const config = getUserConfig();
  if (Array.isArray(config)) {
    _config = config.map((config: Config) => setupConfig(config));
  } else {
    _config = [setupConfig(config as Config)];
  }
  return _config;
}

export function setupConfig(config: Config): Config {
  config = {
    ...defaultConfig,
    ...config
  };
  config.rootPath = path.resolve(rootPath, config.rootPath);
  config.pipeline = config.pipeline.map(
    (pipe: PipelineItem, i: number): PipelineItem => {
      if (i === 0 || i === config.pipeline.length - 1) {
        return path.resolve(
          config.rootPath,
          typeof pipe === 'string' ? pipe : pipe.name
        );
      }
      return typeof pipe === 'string' ? { name: pipe, config: {} } : pipe;
    }
  );
  return config;
}
