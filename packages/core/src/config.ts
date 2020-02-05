import pkgDir from 'pkg-dir';
import { cosmiconfigSync } from 'cosmiconfig';
import defaultConfig from './defaultConfig';
import { Config } from './types';

let _config: Config;

export function getUserConfig(): Partial<Config> {
  const rootPath = pkgDir.sync(process.cwd()) || process.cwd();
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
  _config = {
    ...defaultConfig,
    ...getUserConfig()
  };
  return _config;
}
