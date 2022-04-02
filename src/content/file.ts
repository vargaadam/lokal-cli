import fs from 'fs';

export class File {
  content!: string;

  constructor(private filePath: string) {}

  readFromFile() {
    this.content = fs.readFileSync(this.filePath, 'utf8');
  }
}
