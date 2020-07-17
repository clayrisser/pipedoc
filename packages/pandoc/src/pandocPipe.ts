import { Doc, Options, Pipe } from 'pipedoc';
import globby from 'globby';

export interface PandocPipeConfig {}

export default class PandocPipe extends Pipe {
  constructor(
    public config: PandocPipeConfig = {},
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
