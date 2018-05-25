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

Because [dva](https://github.com/dvajs/dva) is fantastic and unbelievable, but I don't like generator function and immutable, so I instead of them by [async/await](http://babeljs.io/docs/plugins/syntax-async-functions) and [immer](https://github.com/mweststrate/immer)。

And Thanks dva very much,there are up to 90% code copy from dva, i just modify very few code.

There is three diffence between dva and redva

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

onBrithDay,author.age add once,in dva, we must set it by reducer.

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

in redva, mutations is much more simple and readable.

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

in dva, we must learn how to use generator , put, call side effect , and select,put.resolve,take and so on...

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

in redva,we only learn how to use async/await and {dispatch,getState} in redux.that's all,no more complex concept.


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

onError is the key feature in dva,but it is not work well.the above example will triger twice onError

```
const app = new dva({
	onError: (error) => {
		error.preventDefault();
		console.log(error.message);
    }
});
```

if you add error.preventDefault,then the above example will triger right once onError, but also triger 'Happy BirthDay'

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

the right behavior is only trigger once onError, and never trigger 'Happy BirthDay!',this is what redva do onError!

## Demos

* [Count](https://github.com/fishedee/redva/tree/master/examples/counter): Simple count example
* [Async](https://github.com/fishedee/redva/tree/master/examples/async): Simple async example
* [Todo](https://github.com/fishedee/redva/tree/master/examples/todomvc): Simple todo example
* [Dynamic](https://github.com/fishedee/redva/tree/master/examples/dynamic): Simple dynamic load component and model example

## Quick Start

- [Getting Started](https://github.com/fishedee/redva/blob/master/docs/GettingStarted.md)

## FAQ

### Have it unit test case?

Yes! I refactor all dva unit test case to redva unit test case and they all pass.

### Does it support IE8?

No.

## Next

Some basic articles.

* The [8 Concepts](https://github.com/fishedee/redva/blob/master/docs/Concepts.md), and know how they are connected together
* redva [APIs](https://github.com/fishedee/redva/blob/master/docs/API.md)

## License

[MIT](https://tldrlegal.com/license/mit-license)
