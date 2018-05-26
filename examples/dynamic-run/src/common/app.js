import redva from 'redva';
import createHistory from 'history/createHashHistory';

const app = redva({
  history: createHistory(),
});
export default app;
