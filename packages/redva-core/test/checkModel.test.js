import expect from 'expect';
import { create } from '../src/index';

describe('checkModel', () => {
  it('namespace should be defined', () => {
    const app = create();
    expect(() => {
      app.model({});
    }).toThrow(/\[app\.model\] namespace should be defined/);
  });

  it('namespace should be unique', () => {
    const app = create();
    expect(() => {
      app.model({
        namespace: 'repeat',
      });
      app.model({
        namespace: 'repeat',
      });
    }).toThrow(/\[app\.model\] namespace should be unique/);
  });

  it('reducers can be object', () => {
    const app = create();
    expect(() => {
      app.model({
        namespace: '_object',
        mutations: {},
      });
    }).toNotThrow();
  });

  it('reducers can not be array', () => {
    const app = create();
    expect(() => {
      app.model({
        namespace: '_neither',
        mutations: [],
      });
    }).toThrow(/\[app\.model\] mutations should be plain object/);
  });

  it('reducers can not be string', () => {
    const app = create();
    expect(() => {
      app.model({
        namespace: '_neither',
        mutations: '_',
      });
    }).toThrow(/\[app\.model\] mutations should be plain object/);
  });

  it('subscriptions should be plain object', () => {
    const app = create();
    expect(() => {
      app.model({
        namespace: '_',
        subscriptions: [],
      });
    }).toThrow(/\[app\.model\] subscriptions should be plain object/);
    expect(() => {
      app.model({
        namespace: '_',
        subscriptions: '_',
      });
    }).toThrow(/\[app\.model\] subscriptions should be plain object/);
  });

  it('subscriptions can be undefined', () => {
    const app = create();
    expect(() => {
      app.model({
        namespace: '_',
      });
    }).toNotThrow();
  });

  it('effects should be plain object', () => {
    const app = create();
    expect(() => {
      app.model({
        namespace: '_',
        actions: [],
      });
    }).toThrow(/\[app\.model\] actions should be plain object/);
    expect(() => {
      app.model({
        namespace: '_',
        actions: '_',
      });
    }).toThrow(/\[app\.model\] actions should be plain object/);
    expect(() => {
      app.model({
        namespace: '_',
        actions: {},
      });
    }).toNotThrow();
  });
});
