import { Doc, Pipe } from '@pipedoc/core';

export interface PandocPipeConfig {}

export default class PandocPipe extends Pipe {
  constructor(public config: PandocPipeConfig = {}) {
    super({});
  }

  async pipe(doc: Doc): Promise<Doc> {
    return doc;
  }
}
