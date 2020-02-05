import path from 'path';
import { Plugin, Plugins, PluginConfig } from './types';

let _plugins: Plugins;

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
        moduleName,
        name: requiredPlugin.name || moduleName,
        config: requiredPlugin.config || {},
        path: pluginPath
      };
      plugins[plugin.name] = plugin;
      return plugins;
    }, {});
  return _plugins;
}

export function getPlugin(
  pluginName: string,
  rootPath: string,
  pluginConfig: PluginConfig = {}
): Plugin | null {
  const plugins = getPlugins(rootPath);
  const plugin = plugins[pluginName];
  if (!plugin) return null;
  plugin.config = pluginConfig;
  return plugin;
}
