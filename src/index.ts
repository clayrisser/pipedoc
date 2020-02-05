import defaultOptions from './defaultOptions';
import { Options } from './types';

export default class PipeDoc {
  constructor(public options: Options = defaultOptions) {}

  async build() {
    console.log(this.options);
  }
}

export * from './types';
