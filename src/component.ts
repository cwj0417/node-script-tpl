#!/usr/bin/env node
import spawn from 'cross-spawn';
import { cpSync, existsSync, readFileSync, writeFileSync } from 'fs-extra';
import { resolve } from 'path';

const workDir = resolve('');
const scriptDir = resolve(__dirname, '..');

const migrateComponent = () => {
  if (!existsSync(resolve(workDir, 'package.json'))) {
    console.log('请在项目根目录下运行');
    return;
  }
  const pkg = require(resolve(workDir, 'package.json'));

  console.log('添加mlib文件');
  cpSync(resolve(scriptDir, 'tpl'), workDir, { recursive: true });
  writeFileSync(
    resolve(workDir, 'microLib/libName.ts'),
    `export const LIB_NAME = '${pkg.name}';
`,
  );

  console.log('添加mlib脚本');
  pkg.files = ['dist/', 'es/', 'mlib/'];
  pkg.scripts['analyze:microlib'] =
    'xp-sanctuary-scripts react-component analyze:microlib';
  pkg.scripts['build:normal'] = 'xp-sanctuary-scripts react-component build';
  pkg.scripts['build:runtime'] =
    'xp-sanctuary-scripts react-component build:microlib:runtime noCompression';
  pkg.scripts['build:types'] =
    'xp-sanctuary-scripts react-component build:microlib:types';
  pkg.scripts.build =
    'yarn build:runtime && yarn build:types && yarn build:normal';
  pkg.scripts['microlib:register'] =
    'xp-sanctuary-scripts react-component microlib:register';
  pkg.scripts.postpublish = 'yarn microlib:register';
  writeFileSync(resolve(workDir, 'package.json'), JSON.stringify(pkg));

  console.log('添加webpack配置');
  if (existsSync(resolve(workDir, 'webpack-chain.config.js'))) {
    const webpackConf = readFileSync(
      resolve(workDir, 'webpack-chain.config.js'),
    );
    if (!webpackConf.toString().includes(`antd: 'antd4'`)) {
      writeFileSync(
        resolve(workDir, 'webpack-chain.config.js'),
        webpackConf.toString().replace(
          `if (script === 'build') {`,
          `if (script === 'build') {
    config.merge({
      externals: {
        antd: 'antd4',
      },
    });`,
        ),
      );
    }
  }

  console.log('npm install');
  spawn(
    existsSync(resolve(workDir, 'pnpm-lock.yaml'))
      ? 'pnpm'
      : existsSync(resolve(workDir, 'yarn.lock'))
      ? 'yarn'
      : 'npm',
    ['i', '@xforce/micro-lib-proxy'],
    { stdio: 'inherit' },
  ).on('close', () => {
    console.log('完成');
  });
};

export { migrateComponent };
