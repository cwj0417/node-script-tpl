// import { preFetchLib } from '@xforce/micro-lib';
import {
  libReady,
  makeMicroLibRuntimePublicPath,
} from '@xforce/micro-lib-proxy';
import { LIB_NAME } from './libName';

makeMicroLibRuntimePublicPath(LIB_NAME);

async function main() {
  // 如有其他包依赖，且需要在逻辑里静态导入，可在此处执行预抓取
  // await preFetchLib('other-lib');

  const libProperties = await import('./libProperties');
  console.log('libProperties', libProperties);
  libReady(LIB_NAME, libProperties.default);
}

main().catch(console.error);

// avoid isolatedModules warning
export default 'micro lib index file';
