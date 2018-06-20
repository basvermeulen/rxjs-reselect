import { Observable } from 'rxjs/Observable';
import { Action, Dispatch, Store as ReduxStore } from 'redux';
import { Subscription } from 'rxjs/Subscription';
import { PartialObserver } from 'rxjs/src/Observer';
import { map } from 'rxjs/operator/map';
import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged';

export class Store<T> extends Observable<T> {

    private store: ReduxStore<T>;

    constructor(store: ReduxStore<T>) {
        super();

        this.store = store;

        this.source = new Observable((observer) => {
            observer.next(this.store.getState());
            return store.subscribe(() => {
                observer.next(this.store.getState());
            });
        });
    }

    dispatch<A extends Action>(action: A): A {
        return this.store.dispatch(action);
    }

    select<R>(mapFn: (state: T) => R): Observable<R> {
        const mapped$ = map.call(this, mapFn);
        return distinctUntilChanged.call(mapped$);
    }

}
