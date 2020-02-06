import fs from 'fs-extra';
import Doc from '../doc';
import Pipe, { PipeConfig } from '../pipe';

export interface CopyPipeConfig extends PipeConfig {
  to: string;
}

export default class CopyPipe extends Pipe {
  constructor(public config: CopyPipeConfig) {
    super({});
  }

  async pipe(doc: Doc): Promise<Doc> {
    await fs.mkdirs(this.config.to);
    await fs.remove(this.config.to);
    await fs.copy(doc.rootPath, this.config.to);
    return new Doc(doc.type, this.config.to);
  }
}
