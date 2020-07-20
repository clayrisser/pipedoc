import fs from 'fs-extra';
import globby from 'globby';
import Doc from '../doc';
import Pipe, { PipeConfig } from '../pipe';
import defaultOptions from '../defaultOptions';

export interface CopyPipeConfig extends PipeConfig {
  to: string;
}

export default class CopyPipe extends Pipe<CopyPipeConfig> {
  ignoreGlobs?: string[];

  constructor(
    config: CopyPipeConfig,
    options = defaultOptions,
    parent: Pipe<CopyPipeConfig> | null
  ) {
    super(config, options, parent);
  }

  async pipe(doc: Doc): Promise<string[]> {
    const filePaths = await globby(`${doc.rootPath}/${doc.glob}`);
    await fs.mkdirs(this.config.to);
    await fs.remove(this.config.to);
    await fs.copy(doc.rootPath, this.config.to);
    return filePaths;
  }
}
