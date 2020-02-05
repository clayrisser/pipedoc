import defaultConfig from './defaultConfig';
import defaultOptions from './defaultOptions';
import { Config, Options } from './types';
// import { spawn } from './helpers';

export default class PipeDoc {
  constructor(
    public config: Config = defaultConfig,
    public options: Options = defaultOptions
  ) {}

  async build() {
    console.log(this.config);
    console.log(this.options);
  }
}

export { defaultOptions };
export * from './config';
export * from './types';
