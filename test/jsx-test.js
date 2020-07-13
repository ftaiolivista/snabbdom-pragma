
import path from 'path'
import fs from 'fs'
import Buble from 'buble'
import BabelCore from 'babel-core'
import Traceur from 'traceur'
import Typescript from 'typescript'
import test from 'ava'
const {compile} = Traceur
const bubleTransform = Buble.transform
const babelTransform = BabelCore.transform
const transpileModule = Typescript.transpileModule
const __dirname = './test/'

const fixturesDir = path.join(__dirname, 'jsx-specs')

fs.readdirSync(fixturesDir).forEach((caseName) => {
  test(`trans - Should Bublé transform ${caseName.split('-').join(' ')}`, async (t) => {
    const fixtureDir = path.join(fixturesDir, caseName)

    const actual = bubleTransform(
      fs.readFileSync(
        path.join(fixtureDir, 'actual.js')
      ).toString(), {
        transforms: {
          modules: false,
          arrow: false,
          parameterDestructuring: false
        },
        jsx: 'Snabbdom.createElement'
      }
    ).code

    const transform = fs.readFileSync(
      path.join(fixtureDir, 'transform-buble.js')
    ).toString()

    t.is(actual.trim(), transform.trim())
  })

  test(`trans - Should Babel transform ${caseName.split('-').join(' ')}`, (t) => {
    const fixtureDir = path.join(fixturesDir, caseName)

    const actual = babelTransform(
      fs.readFileSync(
        path.join(fixtureDir, 'actual.js')
      ).toString(), {
        plugins: [
          ['transform-react-jsx', { pragma: 'Snabbdom.createElement' }]
        ]
      }
    ).code

    let transform = fs.readFileSync(
      path.join(fixtureDir, 'transform-babel.js')
    ).toString()

    transform = transform.replace(/\r/gm, '')

    t.is(actual.trim(), transform.trim())
  })

  test(`trans - Should Traceur transform ${caseName.split('-').join(' ')}`, (t) => {
    const fixtureDir = path.join(fixturesDir, caseName)

    const actual = compile(
      fs.readFileSync(
        path.join(fixtureDir, 'actual.js')
      ).toString(), {
        jsx: 'Snabbdom.createElement',
        modules: false,
        outputLanguage: 'es6'
      }
    )

    let transform = fs.readFileSync(
      path.join(fixtureDir, 'transform-traceur.js')
    ).toString()

    transform = transform.replace(/\r/gm, '')

    t.is(actual.trim(), transform.trim())
  })

  test(`trans - Should Typescript transform ${caseName.split('-').join(' ')}`, (t) => {
    const fixtureDir = path.join(fixturesDir, caseName)

    const actual = transpileModule(
      fs.readFileSync(
        path.join(fixtureDir, 'actual.js')
      ).toString(), {
        compilerOptions: {
          jsx: 'react',
          jsxFactory: 'Snabbdom.createElement',
          target: 'es6'
        }
      }
    ).outputText

    const transform = fs.readFileSync(
      path.join(fixtureDir, 'transform-typescript.js')
    ).toString()

    t.is(actual.trim(), transform.trim())
  })
})
