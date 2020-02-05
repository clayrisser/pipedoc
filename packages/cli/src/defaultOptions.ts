import pkgDir from 'pkg-dir';
import { Options } from './types';

const options: Options = {
  debug: false,
  paths: {
    root: pkgDir.sync(process.cwd()) || process.cwd()
  }
};

export default options;
