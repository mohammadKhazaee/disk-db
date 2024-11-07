import * as fs from 'fs';
import * as path from 'path';

const directory = [
  path.dirname(require.main.filename),
  '..',
  'src',
  'Common',
  'data',
  'test_collection_files',
];

export const fileEraser = async () => {
  for (const file of await fs.promises.readdir(path.join(...directory))) {
    if (file !== '.gitkeep')
      await fs.promises.unlink(path.join(...directory, file));
  }
};
