import { Store } from './store';
export declare function createStore<T>(reducers: () => T): Store<T>;
export default createStore;
