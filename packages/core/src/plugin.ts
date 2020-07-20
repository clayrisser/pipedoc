import merge from 'merge-configuration';
import path from 'path';
import pkgDir from 'pkg-dir';
import { Plugin, Plugins, PluginConfig } from './types';

let _plugins: Plugins;
const rootPath = pkgDir.sync(process.cwd()) || process.cwd();

export function requireDefault<T = any>(moduleName: string): T {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const required = require(moduleName);
  if (required.__esModule && required.default) return required.default;
  return required;
}

export function getPlugins(rootPath: string): Plugins {
  if (_plugins && Object.keys(_plugins).length) return _plugins;
  const dependencyNames: string[] = Object.keys({
    // eslint-disable-next-line global-require,import/no-dynamic-require
    ...require(path.resolve(rootPath, 'package.json')).dependencies,
    // eslint-disable-next-line global-require,import/no-dynamic-require
    ...require(path.resolve(rootPath, 'package.json')).devDependencies
  });
  _plugins = dependencyNames
    .filter((dependencyName: string) => {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      return !!require(path.resolve(
        rootPath,
        'node_modules',
        dependencyName,
        'package.json'
      )).pipedoc;
    })
    .reduce((plugins: Plugins, moduleName: string) => {
      const pluginPath = path.resolve(
        rootPath,
        'node_modules',
        moduleName,
        // eslint-disable-next-line global-require,import/no-dynamic-require
        require(path.resolve(
          rootPath,
          'node_modules',
          moduleName,
          'package.json'
        )).main
      );
      const requiredPlugin: Plugin = requireDefault<Plugin>(pluginPath);
      const plugin: Plugin = {
        config: requiredPlugin.config || {},
        moduleName,
        name: requiredPlugin.name || moduleName,
        path: pluginPath,
        pipe: requiredPlugin.pipe
      };
      plugins[plugin.name] = plugin;
      return plugins;
    }, {});
  return _plugins;
}

export function getPlugin(
  pluginName: string,
  pluginConfig: PluginConfig = {}
): Plugin | null {
  const plugins = getPlugins(rootPath);
  const plugin = plugins[pluginName];
  if (!plugin) return null;
  plugin.config = merge(plugin.config, pluginConfig);
  return plugin;
}
