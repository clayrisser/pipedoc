import defaultOptions from './defaultOptions';
import { Options } from './types';
// import { spawn } from './helpers';

export default class PipeDoc {
  constructor(public options: Options = defaultOptions) {}

  async build() {
    console.log(this.options);
  }
}

export { defaultOptions };
export * from './types';
