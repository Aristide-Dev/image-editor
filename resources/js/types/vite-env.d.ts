/// <reference types="vite/client" />

// onnxruntime-web ships types.d.ts but omits a "types" condition in package
// "exports", so moduleResolution bundler cannot resolve them automatically.
/// <reference path="../../../node_modules/onnxruntime-web/types.d.ts" />
