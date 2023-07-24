import { deepmerge } from './utils'
import type { Options } from './types'

/**
 * Merges the default configuration options with the provided.
 *
 * @param options
 */
export function createInitConfig(options: Options): Options {
  const config = deepmerge<Options>({
    dir: options.dir,
    verbose: false,
    input: {
      templates: {
        dir: `${options.dir}`,
      },
    },
    output: {
      auto: true,
      dir: `${options.dir}/.vuemail`,
    },
  }, options)

  return config
}

/**
 * Validates the configuration object.
 *
 * @param config
 */
export function validateConfig(config: Options): void {
  // TODO: add a good console logging
  console.log('Validating configuration...')

  const required: (keyof Options)[] = ['dir']
  const missing = required.filter(r => !config[r])

  if (missing.length) {
    throw new Error('The following configuration options are missing: ' + missing.join(', '))
  }
}
