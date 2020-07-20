import execa from 'execa';
import globby from 'globby';
import path from 'path';
import { Doc, Options, Pipe } from 'pipedoc';

export interface PandocPipeConfig {
  format: string;
}

export default class PandocPipe extends Pipe<PandocPipeConfig> {
  acceptedTypes = new Set(['md', 'pdf', 'rst', 'html', 'doc', 'docx', 'rtf']);
  toType?: string;

  constructor(
    config: PandocPipeConfig,
    options: Options,
    parent: Pipe<PandocPipeConfig> | null
  ) {
    super(config, options, parent);
    this.toType = config.format;
  }

  async pipe(doc: Doc): Promise<Doc> {
    const filePaths = await globby(`${doc.rootPath}/${doc.glob}.${doc.type}`);
    await Promise.all(
      filePaths.map(async (filePath: string) => {
        const filePathParts = filePath
          .substr(doc.rootPath.length + 1)
          .split('.');
        filePathParts.pop();
        const fileName = [...filePathParts, this.config.format].join('.');
        await this.convertFile(
          filePath,
          path.resolve(this.paths.tmp, fileName)
        );
      })
    );
    return doc;
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
