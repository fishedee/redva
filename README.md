# redva

[以中文查看](./README_zh-CN.md)

Lightweight front-end framework based on [redux](https://github.com/reactjs/redux), [async/await](http://babeljs.io/docs/plugins/syntax-async-functions) , [immer](https://github.com/mweststrate/immer) and [react-router](https://github.com/ReactTraining/react-router). (Inspired by [dva](https://github.com/dvajs/dva))

---

## Features

* **Easy to learn, easy to use**: only 6 apis, very friendly to redux users
* **Vue concepts**: organize models with `mutations`, `actions` and `subscriptions`
* **Support mobile and react-native**: cross platform
* **Support load model and routes dynamically**: Improve performance ([Example](https://github.com/fishedee/redva/blob/master/docs/API.md#dvadynamic))
* **Plugin system**: e.g. we have [redva-loading](https://github.com/fishedee/redva/tree/master/packages/dva-loading) plugin to handle loading state automatically

## Attention

* **Do Not Support HMR**
* **Do Not Support TypeScript**

## Why redva ?

Because [dva](https://github.com/dvajs/dva)) is fantastic and unbelievable, but I don't like generator function and immutable, so I instead of them by [async/await](http://babeljs.io/docs/plugins/syntax-async-functions) and [immer](https://github.com/mweststrate/immer)。

And Thanks dva very much,there are up to 50% code copy from dva, i just modify very few code.

## Demos

* [Count](https://github.com/fishedee/redva/tree/master/examples/counter): Simple count example
* [Async](https://github.com/fishedee/redva/tree/master/examples/async): Simple async example
* [Todo](https://github.com/fishedee/redva/tree/master/examples/todo): Simple todo example

## Quick Start

- [Getting Started](https://github.com/fishedee/redva/blob/master/docs/GettingStarted.md)

## FAQ

### Have it have unit test case?

Yes! I refactor all dva unit test case to redva unit test case and they all work

### Does it support IE8?

No.

## Next

Support HMR and Typescript

## License

[MIT](https://tldrlegal.com/license/mit-license)
