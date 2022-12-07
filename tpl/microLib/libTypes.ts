import { exposeLib } from '@xforce/micro-lib-proxy';
import { LIB_NAME } from './libName';
import type { LibProperties } from './libProperties';

export const lib = exposeLib<LibProperties>(LIB_NAME);

export default lib;
