import { resolve } from 'path'
import { defineConfig } from '../compiler'
import { describe, expect, it } from 'vitest'

describe('compiler', () => {
  it('It should compile vue files', () => {
    const path = resolve(__dirname, './templates')

    const vuemail = defineConfig({
      dir: path,
    })

    vuemail.render('example')

    expect(true).toBe(true)
  })
})
