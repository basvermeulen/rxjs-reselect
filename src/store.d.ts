import { Observable } from 'rxjs/Observable';
import { Store as ReduxStore } from 'redux';
export declare class Store<T> extends Observable<T> {
    constructor(store: ReduxStore<T>);
}
