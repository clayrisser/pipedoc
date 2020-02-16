import { Doc, Options, Pipe } from '@pipedoc/core';

export interface SphinxPipeConfig {}

export default class SphinxPipe extends Pipe {
  constructor(public config: SphinxPipeConfig = {}, options: Options) {
    super({}, options);
  }

  async pipe(doc: Doc): Promise<Doc> {
    console.log('plugin', 'sphinx');
    console.log('doc', doc);
    console.log('config', this.config);
    console.log('options', this.options);
    return doc;
  }
}
