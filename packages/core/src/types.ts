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

export interface Pipes {
  [key: string]: Pipe;
}

export interface Pipeline {
  name: string;
  pipes: Pipes;
}
