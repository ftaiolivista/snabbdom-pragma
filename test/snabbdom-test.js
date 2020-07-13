
import path from 'path'
import fs from 'fs'

import test from 'ava'

import { h } from 'snabbdom/h'
import SRC from '../src/index.js'
import {createElement as dist} from '../dist/index.es6.js'

const src = SRC.createElement

const fixturesDir = 'snabbdom-specs'

fs.readdirSync('test/'+fixturesDir).forEach((caseName) => {
  test(`src - Should works for ${caseName.split('-').join(' ')}`, async (t) => {
    const fixtureDir = path.join(fixturesDir, caseName)

    const actual = (await import(
      './' + path.join(fixtureDir, 'actual.js')
    )).default(src)

    const expected = (await import(
      './' + path.join(fixtureDir, 'expected.js')
    )).default(h)

    t.deepEqual(actual, expected)
  })

  test(`dist - Should works for ${caseName.split('-').join(' ')}`, async (t) => {
    const fixtureDir = path.join(fixturesDir, caseName)

    const actual = (await import(
      './' + path.join(fixtureDir, 'actual.js')
    )).default(dist)

    const expected = (await import(
      './' + path.join(fixtureDir, 'expected.js')
    )).default(h)

    t.deepEqual(actual, expected)
  })
})
