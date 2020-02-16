import Pipe, { PipeConfig } from './pipe';

export interface Options {
  debug: boolean;
  paths: Paths;
}

export interface Paths {
  root: string;
  tmp: string;
}

export type PipelineItem =
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
  pipe: typeof Pipe;
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
  pipeline: PipelineItem[];
  rootPath: string;
  type: string;
}

export * from './pipe';
