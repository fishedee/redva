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

非常感谢dva，redva中的90%的代码都是直接从dva中copy过来的，这只是dva的一个分支而已。

这里有三个不同点在dva与redva之间

### mutations

```
export default {
	namespace:'author',
	state:{
		name:'fish',
		sex:'man',
		age:17,
	},
	reducers:{
		onBirthDay(state,action){
			return {
				...state,
				age:state.age+1
			}
		}
	}
}
```

当onBrithDay触发时，希望author.age加一。在dva里面, 为了保证immutable，我们需要一些别扭的写法。

```
export default {
	namespace:'author',
	state:{
		name:'fish',
		sex:'man',
		age:17,
	},
	mutations:{
		onBirthDay(state,action){
			state.author.age += 1
		}
	}
}
```

在redva里，你不需要考虑immutable的问题，你可以随意将state对象修改就可以了。redva会检测出修改的地方，然后转换为一个immutable对象，这正是immerjs大展身手的地方。

### async action

```
export default {
	namespace:'author',
	state:{
		name:'fish',
		sex:'man',
		age:17,
	},
	reducers:{
		onBirthDay(state,action){
			return {
				...state,
				age:state.age+1
			}
		}
	},
	effects:{
		*waitNextBirthDay(state,{put,call}){
			yield call(delay,60*60*24*365)
			yield put.resolve({
				type:'onBirthDay'
			})
			console.log('Happy BirthDay!');
		}
	}
}
```

在dva，如果需要处理异步action，我们需要学习redux-sage，学习如何使用generator函数，含有put,call,select,put.resolve,take等sage的算子。

```
export default {
	namespace:'author',
	state:{
		name:'fish',
		sex:'man',
		age:17,
	},
	mutations:{
		onBirthDay(state,action){
			state.author.age += 1
		}
	},
	actions:{
		async waitNextBirthDay(state,{dispatch,getState}){
			await delay(60*60*24*365)
			await dispatch({
				type:'onBirthDay'
			})
			console.log('Happy BirthDay!');
		}
	}
}
```

在redva，我们只需要学习async/await，以及redux里面原有的两个函数dispatch和getState。这就是全部，没有其他任何你需要额外学习的算子。

### onError

```
const app = new dva({
	onError: (error) => {
		console.log(error.message);
    }
});
app.model({
	namespace:'author',
	state:{
		name:'fish',
		sex:'man',
		age:17,
	},
	reducers:{
		onBirthDay(state,action){
			return {
				...state,
				age:state.age+1
			}
		}
	},
	effects:{
		*doBirthDay(state,{put,call}){
			throw new Error('oh my god!');
			yield put.resolve({
				type:'onBirthDay'
			})
		},
		*waitNextBirthDay(state,{put,call}){
			yield call(delay,100)
			yield put.resolve({
				type:'doBirthDay'
			})
			console.log('Happy BirthDay!');
		}
	}
})

app.start();
app._store.dispatch({
	type: 'author/waitNextBirthDay',
})
```

onError是dva里面的杀手级功能，但它处理得并不是十分恰当。在上面的例子中，一个错误，会被onError触发两次。

```
const app = new dva({
	onError: (error) => {
		error.preventDefault();
		console.log(error.message);
    }
});
```

如果你加入error.preventDefault，上面的例子就会只触发一次onError，但异常没有阻止waitNextBirthDay中的流程，在异常发生的情况下，依然触发了'Happy BirthDay'的输出，这显然不是我们想要的。

```
const app = new redva({
	onError: (error) => {
		error.preventDefault();
		console.log(error.message);
    }
});
app.model({
	namespace:'author',
	state:{
		name:'fish',
		sex:'man',
		age:17,
	},
	mutations:{
		onBirthDay(state,action){
			state.author.age += 1
		}
	},
	actions:{
		async doBirthDay(state,{dispatch}){
			throw new Error('oh my god!');
			await dispatch({
				type:'onBirthDay'
			})
		},
		async waitNextBirthDay(state,{dispatch}){
			await delay(100)
			await dispatch({
				type:'doBirthDay'
			})
			console.log('Happy BirthDay!');
		}
	}
})

app.start();
app._store.dispatch({
	type: 'author/waitNextBirthDay',
})
```

我认为更好的做法是，onError只在顶层dispatch做一个try/catch操作，那么当异常触发时，onError只会触发一次，而且'Happy BirthDay!'也永远都不会输出，这正是redva的做法。

## Demos

* [Count](https://github.com/fishedee/redva/tree/master/examples/counter): 简单计数器例子
* [Async](https://github.com/fishedee/redva/tree/master/examples/async): 简单异步例子
* [Todo](https://github.com/fishedee/redva/tree/master/examples/todomvc): 简单Todo例子
* [Dynamic](https://github.com/fishedee/redva/tree/master/examples/dynamic): 简单的动态获取component和model的例子

## 快速上手

- [快速上手](https://github.com/fishedee/redva/blob/master/docs/GettingStarted.md)

## FAQ

### 是否有单元测试

我将原来dva的所有单元测试都移植到redva上，并且所有的单元测试都已经通过了。

### 是否支持 IE8 ？

不支持。

## 下一步

基础文章

* redva [8 个概念](https://github.com/fishedee/redva/blob/master/docs/Concepts_zh-CN.md)
* redva [APIs](https://github.com/fishedee/redva/blob/master/docs/API_zh-CN.md)

## License

[MIT](https://tldrlegal.com/license/mit-license)
