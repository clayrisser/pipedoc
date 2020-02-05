export interface Options {
  debug: boolean;
  paths: Paths;
}

export interface Paths {
  root: string;
}

export interface PipeConfig {
  [key: string]: any;
}

export type Pipe =
  | string
  | {
      config: PipeConfig;
      name: string;
    };

export interface Plugin {
  config: PluginConfig;
  moduleName: string;
  name: string;
  path: string;
}

export interface Plugins {
  [key: string]: Plugin;
}

export interface PluginConfig {
  [key: string]: any;
}

export interface Pipes {
  [key: string]: Pipe;
}

export interface Config {
  name?: string;
  pipeline: Pipe[];
  rootPath: string;
}
