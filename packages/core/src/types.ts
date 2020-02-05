export interface Options {
  debug: boolean;
  paths: Paths;
}

export interface Paths {
  root: string;
}

export interface PipeConfig {
  path: string;
  [key: string]: any;
}

export interface Pipe {
  config: PipeConfig;
  from: string;
  pipe: string;
}

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

export interface Pipeline {
  name: string;
  pipes: Pipes;
}
