import Doc from './doc';
import defaultOptions from './defaultOptions';

export interface PipeConfig {}

export default class Pipe {
  constructor(public config: PipeConfig, public options = defaultOptions) {}

  async pipe(doc: Doc): Promise<Doc> {
    return doc;
  }
}
