import execa from 'execa';
import globby from 'globby';
import path from 'path';
import { Doc, Options, Pipe } from 'pipedoc';

export interface PandocPipeConfig {
  to: string;
  glob?: string;
}

export default class PandocPipe extends Pipe<PandocPipeConfig> {
  ignoreGlobs?: string[];

  constructor(
    config: PandocPipeConfig,
    options: Options,
    parent: Pipe<PandocPipeConfig> | null
  ) {
    super(config, options, parent);
  }

  async pipe(doc: Doc): Promise<string[]> {
    const filePaths = await globby(
      `${doc.rootPath}/${this.config.glob || doc.glob}`
    );
    await Promise.all(
      filePaths.map(async (filePath: string) => {
        const filePathParts = filePath
          .substr(doc.rootPath.length + 1)
          .split('.');
        filePathParts.pop();
        const fileName = [...filePathParts, this.config.to].join('.');
        await this.convertFile(
          filePath,
          path.resolve(this.paths.tmp, fileName)
        );
      })
    );
    return filePaths;
  }

  async convertFile(
    fromPath: string,
    toPath: string,
    format?: string
  ): Promise<string> {
    return (
      await execa(
        'pandoc',
        ['-o', toPath, ...(format ? ['-t', format] : []), fromPath],
        {
          stdio: 'pipe'
        }
      )
    ).stdout;
  }
}
