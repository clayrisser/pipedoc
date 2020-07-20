import fs from 'fs-extra';
import globby from 'globby';
import path from 'path';
import { Doc, Options, Pipe } from 'pipedoc';

export interface SphinxPipeConfig {}

export default class SphinxPipe extends Pipe<SphinxPipeConfig> {
  acceptedTypes?: Set<string>;
  toType?: string;

  constructor(
    config: SphinxPipeConfig = {},
    options: Options,
    parent: Pipe | null
  ) {
    super(config, options, parent);
  }

  async pipe(doc: Doc): Promise<Doc> {
    const filePaths = await globby(`${doc.rootPath}/${doc.glob}`);
    await Promise.all(
      filePaths.map(async (filePath: string) => {
        const fileName = filePath.substr(doc.rootPath.length + 1);
        await fs.copyFile(filePath, path.resolve(this.paths.tmp, fileName));
      })
    );
    return doc;
  }
}
