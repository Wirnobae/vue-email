import * as fs from 'node:fs';
import * as $path from 'node:path';

export const isDirectory = (path: string): boolean => fs.statSync(path).isDirectory()
export const isFile = (path: string): boolean => fs.statSync(path).isFile()

export const getFiles = (path: string): string[] =>
  fs.readdirSync(path)
    .map((name) => $path.join(path, name))
    .filter(isFile)

export const getDirectories = (path: string): string[] =>
  fs.readdirSync(path)
    .map((name) => $path.join(path, name))
    .filter(isDirectory)

export const getFilesRecusively = (path: string): string[] => {
  const dirs = getDirectories(path)
  const files = dirs
    .map((dir) => getFilesRecusively(dir))
    .reduce((a, b) => a.concat(b), [])

  return files.concat(getFiles(path))
}

export const readFile = (path: string) => fs.readFileSync(path, 'utf8').toString()

export const writeFile = (path: string, data: string | NodeJS.ArrayBufferView): void => {
  fs.mkdirSync(path.substring(0, path.lastIndexOf($path.sep)), {
    recursive: true,
  })

  return fs.writeFileSync(path, data)
}
