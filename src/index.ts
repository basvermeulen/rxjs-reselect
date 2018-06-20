import { Store } from './store';
import { Store as ReduxStore, createStore as createReduxStore, Reducer, StoreEnhancer } from 'redux';

export { Store };

export * from 'reselect';

export function createStore<T>(reducers: Reducer<T>, enhancer?: StoreEnhancer<T>): Store<T> {
    const store: ReduxStore<T> = createReduxStore(reducers, enhancer);
    return new Store(store);
}

export default createStore;
