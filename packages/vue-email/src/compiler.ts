import { createSSRApp, type Component} from 'vue'
import { renderToString } from 'vue/server-renderer'
import { transpile } from 'typescript'
import { parse } from 'vue/compiler-sfc'
import { createInitConfig } from './config'
import { normalize} from 'path'
import { getFilesRecusively, readFile, writeFile } from './utils'

import type { DeepRequired, Options, RenderOptions } from './types'

const convertSFC = (path: string): string => {
  const COMPONENT_START = 'export default defineComponent({'

  const data = readFile(path)
  const parsed = parse(data)

  if (!parsed.descriptor) {
    throw new Error('An error occurred while parsing component')
  }

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
    .map(s => s.content)
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

  component = transpile(component);

  return component
}

const compileTemplate = (path: string, config: Options): void => {
  const $path = normalize(path)
  const component = convertSFC($path)
  const normalizedDir = normalize(config?.input?.templates?.dir ?? '')

  let name = path.substring(
    path.indexOf(normalizedDir) + normalizedDir.length + 1,
  )

  if (name.includes('.vuemail/')) {
    name = name.split('/')[1]
  }

  const finalPath = normalize(config?.output?.dir + '/' + name.replace('.vue', '.js'))

  writeFile(finalPath, component)
}

const render = async (
  name: string,
  options?: RenderOptions,
  config?: Options,
): Promise<string> => {
  const component: Component = (
    await import(`${config?.dir}/.vuemail/${name}`)
  ).default

  const app = createSSRApp(component, options?.props);
  const content = await renderToString(app)

  return content;
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
