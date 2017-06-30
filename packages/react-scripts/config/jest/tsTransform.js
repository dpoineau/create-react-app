'use strict';
// Based on: https://github.com/facebook/jest/issues/1466#issuecomment-269421820
// with modifications to use ./babelTransform.js instead of babel-jest directly
const babelJest = require('./babelTransform.js');
const paths = require('../paths');
const pathModule = require('path');
const fs = require('fs-extra');

const tsc = require(pathModule.resolve(paths.appNodeModules, 'typescript'));

module.exports = {
  process(src, path) {
    const isTs = path.endsWith('.ts');
    const isTsx = path.endsWith('.tsx');

    // tsconfig loading code based on
    // https://github.com/tildeio/broccoli-typescript-compiler/commit/ff874d99dbd2b691a5298c7061db134262d72dd0?w=1

    const configJson = tsc.parseConfigFileTextToJson(paths.appTsConfig, fs.readFileSync(paths.appTsConfig, 'utf8'), true);
    const tsCompilerOptionsResult = tsc.convertCompilerOptionsFromJson(configJson.config.compilerOptions, pathModule.dirname(paths.appTsConfig), "tsconfig.json");
    const tsCompilerOptions = tsCompilerOptionsResult.options;

    if (isTs || isTsx) {
      src = tsc.transpileModule(
        src,
        {
          reportDiagnostics: true,
          compilerOptions: tsCompilerOptions,
          fileName: path
        }
      );
      if (src.diagnostics.length > 0) {
        console.log(src.diagnostics);
      }

      src = src.outputText;

      // update the path so babel can try and process the output
      path = path.substr(0, path.lastIndexOf('.')) + (isTs ? '.js' : '.jsx') || path;
    }

    if (path.endsWith('.js') || path.endsWith('.jsx')) {
      src = babelJest.process(src, path);
    }
    return src;
  },
};
