import { Doc, Options, Pipe } from '@pipedoc/core';

export interface PandocPipeConfig {}

export default class PandocPipe extends Pipe {
  constructor(public config: PandocPipeConfig = {}, options: Options) {
    super({}, options);
  }

  async pipe(doc: Doc): Promise<Doc> {
    console.log('plugin', 'pandoc');
    console.log('doc', doc);
    console.log('config', this.config);
    console.log('options', this.options);
    return doc;
  }
}
