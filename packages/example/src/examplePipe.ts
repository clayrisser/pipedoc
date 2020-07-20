import fs from 'fs-extra';
import globby from 'globby';
import path from 'path';
import { Doc, Options, Pipe } from 'pipedoc';

export interface ExamplePipeConfig {}

export default class ExamplePipe extends Pipe<ExamplePipeConfig> {
  ignoreGlobs?: string[];

  constructor(
    config: ExamplePipeConfig = {},
    options: Options,
    parent: Pipe | null
  ) {
    super(config, options, parent);
  }

  async pipe(doc: Doc): Promise<string[]> {
    const filePaths = await globby(`${doc.rootPath}/${doc.glob}`);
    await Promise.all(
      filePaths.map(async (filePath: string) => {
        const fileName = filePath.substr(doc.rootPath.length + 1);
        await fs.copyFile(filePath, path.resolve(this.paths.tmp, fileName));
      })
    );
    return filePaths;
  }
}
