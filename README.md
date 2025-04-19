docker run --rm -it -v ./output:/src/output -v ./scripts:/src/scripts/ -v ./module:/src/module libxslt-wasm /bin/sh

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. It makes use of the following libraries:

- [libxml2](http://xmlsoft.org) which is licensed under the MIT License ([libxml2/Copyright](libxml2/Copyright))
- [libxslt](http://xmlsoft.org/libxslt/) which is licensed under the MIT License ([libxslt/Copyright](libxslt/Copyright))
- [xmlhttprequest-ssl](https://github.com/mjwwit/node-XMLHttpRequest#readme) which is licensed under the MIT License ([mjwwit/node-XMLHttpRequest/LICENSE](https://github.com/mjwwit/node-XMLHttpRequest/blob/main/LICENSE))
- [Emscripten](https://emscripten.org/) which is available under 2 licenses, the MIT license and the University of Illinois/NCSA Open Source License ([emscripten-core/emscripten](https://github.com/emscripten-core/emscripten/blob/main/LICENSE))
