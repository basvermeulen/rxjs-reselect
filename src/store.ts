import { Observable, Subscription, PartialObserver } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { Action, Dispatch, Store as ReduxStore } from 'redux';

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
        return this.pipe(
            map(mapFn),
            distinctUntilChanged()
        );
    }

}
