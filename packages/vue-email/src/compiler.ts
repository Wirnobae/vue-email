import { createSSRApp, type Component, createApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { parse } from 'vue/compiler-sfc'
import * as file from 'fs'
import { createInitConfig } from './config'
import type { DeepRequired, Options, RenderOptions } from './types'
import { readdirSync, statSync } from 'fs'
import { join, normalize, sep } from 'path'

const isDirectory = (path: string): boolean => statSync(path).isDirectory()
const isFile = (path: string): boolean => statSync(path).isFile()

const getFiles = (path: string): string[] =>
  readdirSync(path)
    .map((name) => join(path, name))
    .filter(isFile)

const getDirectories = (path: string): string[] =>
  readdirSync(path)
    .map((name) => join(path, name))
    .filter(isDirectory)

const getFilesRecusively = (path: string): string[] => {
  const dirs = getDirectories(path)
  const files = dirs
    .map((dir) => getFilesRecusively(dir))
    .reduce((a, b) => a.concat(b), [])

  return files.concat(getFiles(path))
}

const readFile = (path: string) => file.readFileSync(path, 'utf8').toString()

const writeFile = (path: string, data: string | NodeJS.ArrayBufferView): void => {
  file.mkdirSync(path.substring(0, path.lastIndexOf(sep)), {
    recursive: true,
  })

  return file.writeFileSync(path, data)
}

const convertSFC = (path: string): string => {
  const COMPONENT_START = 'export default defineComponent({'

  const data = readFile(path)
  const parsed = parse(data)

  if (!parsed.descriptor) {
    throw new Error('An error occurred while parsing component')
  }

  console.log(parsed)

  const { template: t } = parsed.descriptor
  let template = t?.content

  if (!template) {
    template = ''
  }

  template = template
    .replace(/[\n\r]/gi, ' ')
    .replace(/"/gi, '\\"')
    .replace(/\s\s+/gi, ' ')

  const x = parsed.descriptor.styles
    .map((s) => s.content)
    .join('\n\n')
    .replace(/[\n\r]/gi, '')
    .replace(/"/gi, '\\"')
    .replace(/\s\s+/gi, '')

  const b = `\nstyle: "${x}",\n`

  template = `\ntemplate: "${template}",\n`

  const s = parsed.descriptor.script
  let script = s?.content

  if (!script) {
    script = ''
  }

  const position = script.indexOf(COMPONENT_START) + COMPONENT_START.length
  let component =
    script.substring(0, position) + template + script.substring(position)

  component =
    component.substring(0, position + template.length) +
    b +
    script.substring(position)

  component = component.replace(new RegExp('.vue\'', 'g'), '\'')

  console.log(component)

  return component
}

const compileTemplate = (path: string, config: Options): void => {
  const $path = normalize(path)
  const component = convertSFC($path)
  const normalizedDir = normalize(config?.input?.templates?.dir ?? '')

  const name = path.substring(
    path.indexOf(normalizedDir) + normalizedDir.length + 1,
  )

  const finalPath = normalize(config?.output?.dir + '/' + name.replace('.vue', '.js'))

  writeFile(finalPath, component)
}

const render = async (
  name: string,
  options?: RenderOptions,
  config?: Options,
): Promise<string> => {
  // const component: Component = (
  //   await require(`${config?.dir}/${name}.vue`)
  // ).default

  return Promise.resolve('')
}

export const defineConfig = (config: DeepRequired<Options>) => {
  const defaultConfig = createInitConfig(config)
  const dir = config?.dir ?? defaultConfig?.dir
  const files = getFilesRecusively(dir)

  for (const path of files) {
    compileTemplate(path, defaultConfig)
  }

  return {
    render: (name: string, options?: RenderOptions): Promise<string> => {
      return render(name, options, defaultConfig)
    },
  }
}
