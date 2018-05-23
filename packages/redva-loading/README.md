# redva-loading

Auto loading plugin for redva. :clap: You don't need to write `showLoading` and `hideLoading` any more.

---

## Install

```bash
$ npm install redva-loading --save
```

## Usage

```javascript
import createLoading from 'redva-loading';

const app = redva();
app.use(createLoading(opts));
```

Then we can access loading state from store.

### opts

- `opts.namespace`: property key on global state, type String, Default `loading`

[See real project usage on dva-hackernews](https://github.com/dvajs/dva-hackernews/blob/2c3330b1c8ae728c94ebe1399b72486ad5a1a7a0/src/index.js#L4-L7).

## State Structure

```
loading: {
  global: false,
  models: {
    users: false,
    todos: false,
    ...
  },
}
```

## License

[MIT](https://tldrlegal.com/license/mit-license)
