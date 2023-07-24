import { resolve } from 'path'
import { defineConfig } from '../compiler'
import { describe, expect, it } from 'vitest'

describe('compiler', () => {
  it('It should compile vue files', async () => {
    const path = resolve(__dirname, './templates')

    const vuemail = defineConfig({
      dir: path,
    })

    const template = await vuemail.render('example', {
      props: {
        show: true,
        name: 'Dave'
      }
    })

    expect(template).toBe('<h1>Hi Dave</h1>')
  })
})
