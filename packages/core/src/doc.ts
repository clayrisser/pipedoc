export default class Doc {
  public convertedFilePaths?: string[];

  constructor(public rootPath: string, public glob = '**/*') {}
}
