import { Doc, Pipe } from '@pipedoc/core';

export interface SphinxPipeConfig {}

export default class SphinxPipe extends Pipe {
  constructor(public config: SphinxPipeConfig = {}) {
    super({});
  }

  async pipe(doc: Doc): Promise<Doc> {
    console.log('sphinx pipe -> ', doc);
    return doc;
  }
}
