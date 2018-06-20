import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import rewiremock, { plugins } from 'rewiremock';

import { Subscription } from 'rxjs/Subscription';
import { Action, createStore as createReduxStore, Store as ReduxStore } from 'redux';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import { Store } from '../src/store';

describe('store', () => {

    let instance: Store<any>;

    let sandbox: sinon.SinonSandbox;
    let observer: { next: sinon.SinonStub };
    let observable: { Observable: sinon.SinonSpy },
        map: { call: sinon.SinonStub },
        distinctUntilChanged: { call: sinon.SinonStub };

    before(() => {
        sandbox = sinon.createSandbox();

        observer = { next: sandbox.stub() };

        map = { call: sandbox.stub() };
        distinctUntilChanged = { call: sandbox.stub() };

        observable = {
            Observable: sinon.spy((subscribe: (observer: any) => Subscription | void) => {
                if (subscribe) {
                    subscribe(observer);
                }

                return new Observable();
            })
        };
    });

    function createMockedStore<T>(store: ReduxStore<T>, withMockedObservable = false): Promise<Store<T>> {
        return rewiremock.around(
            () => import('../src/store'),
            (mock) => {
                mock.addPlugin(plugins.nodejs);
                if (withMockedObservable) {
                    mock('rxjs/Observable').with(observable);
                }
                mock('rxjs/operator/map').with({map});
                mock('rxjs/operator/distinctUntilChanged').with({distinctUntilChanged});
            }
        )
        .then(result => result)
        .then(({Store}) => new Store<T>(store))
    }

    describe('constructor', () => {
        const store = createReduxStore(() => {});

        before(() => {
            return createMockedStore<any>(store, true).then((subject) => {
                instance = subject;
            });
        });

        it('should subscribe to the inner source and call the observer\'s next with the store\'s state', () => {
            store.dispatch({ type: '' } as Action);
            expect(observer.next.called).to.be.true;
        });
    });

    describe('methods', () => {
        let store: any;

        before(() => {
            store = {
                subscribe: sinon.stub(),
                dispatch: sinon.stub(),
                getState: sinon.stub(),
                replaceReducer: (): any => null
            };

            return createMockedStore<any>(store).then((subject) => {
                instance = subject;
            });
        });

        describe('dispatch method', () => {
            it('should call the dispatch function of the inner Redux store', () => {
                const action: Action = { type: '' } as Action;
                instance.dispatch(action);
                expect(store.dispatch.calledWith(action)).to.be.true;
            });
        });

        describe('select method', () => {
            it('should call map\'s and distinctUntilChanged\'s call', () => {
                const fn = () => {};
                const emptyObservable = Observable.empty();
                map.call.returns(emptyObservable);

                instance.select(fn);

                expect(map.call.calledWith(instance, fn)).to.be.true;
                expect(distinctUntilChanged.call.calledWith(emptyObservable)).to.be.true;
            });
        });
    });

    afterEach(() => {
        sandbox.reset();
    });

});
