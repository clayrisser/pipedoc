// import fs from 'fs-extra';
import globby from 'globby';
import { Doc, Options, Pipe } from 'pipedoc';

export interface SphinxPipeConfig {}

export default class SphinxPipe extends Pipe {
  constructor(
    public config: SphinxPipeConfig = {},
    options: Options,
    parentPath: string,
    parent: Pipe | null
  ) {
    super({}, options, parentPath, parent);
  }

  async pipe(doc: Doc): Promise<Doc> {
    console.log(this.parentPath);
    const files = await globby(`${this.parentPath}/${doc.glob}`);
    console.log('files', files);
    return doc;
  }
}
