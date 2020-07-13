
import path from 'path'
import fs from 'fs'

import test from 'ava'

const fixturesDir = 'build-specs'

fs.readdirSync('./test/'+fixturesDir).forEach((caseName) => {
  test(`Should works for ${caseName.split('-').join(' ')}`, async (t) => {
    const fixtureDir =fixturesDir +'/'+ caseName
    console.log('IMPORT', './'+fixtureDir+'/actual.js')
    const actual = (await import('./'+fixtureDir+'/actual.js')).default()

    const expected = (await import('./'+fixtureDir+'/expected.js')).default()

    t.deepEqual(actual, expected)
  })
})
