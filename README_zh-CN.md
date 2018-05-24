# redva

[View README in English](README.md)

基于 [redux](https://github.com/reactjs/redux)、[async/await](http://babeljs.io/docs/plugins/syntax-async-functions) , [immer](https://github.com/mweststrate/immer) 和 [react-router](https://github.com/ReactTraining/react-router) 的轻量级前端框架。(Inspired by [dva](https://github.com/dvajs/dva))

---

## 特性

* **易学易用**：仅有 6 个 api，对 redux 用户尤其友好
* **vue 概念**：通过 `mutations`, `actions` 和 `subscriptions` 组织 model
* **支持 mobile 和 react-native**：跨平台 
* **动态加载 Model 和路由**：按需加载加快访问速度 ([例子](https://github.com/fishedee/redva/blob/master/docs/API_zh-CN.md#dvadynamic))
* **插件机制**：比如 [dva-loading](https://github.com/fishede/redva/tree/master/packages/dva-loading) 可以自动处理 loading 状态，不用一遍遍地写 showLoading 和 hideLoading

## 注意

* **目前不支持 HMR**
* **目前不支持 TypeScript**

## 为什么用 redva ?

因为dva的开发模式超级正点，顺手，简单快速，只是我不太喜欢generator函数和immutable的繁琐修改方式，我将其改为[async/await](http://babeljs.io/docs/plugins/syntax-async-functions)的异步，以及[immerjs](https://github.com/mweststrate/immer)实现的immutable。

## Demos

* [Count](https://github.com/fishedee/redva/tree/master/examples/counter): 简单计数器例子
* [Async](https://github.com/fishedee/redva/tree/master/examples/async): 简单异步例子
* [Todo](https://github.com/fishedee/redva/tree/master/examples/todo): 简单Todo例子

## 快速上手

- [Getting Started](https://github.com/fishedee/redva/blob/master/docs/GettingStarted.md)

## FAQ

### 是否有单元测试

我将原来dva的所有单元测试都移植到redva上，并且所有的单元测试都已经通过了。

### 是否支持 IE8 ？

不支持。

## 下一步

实现HMR和TypeScript的支持。

## License

[MIT](https://tldrlegal.com/license/mit-license)
