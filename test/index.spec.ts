import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import rewiremock, { plugins } from 'rewiremock';

describe('createStore', () => {

    let sandbox: sinon.SinonSandbox;
    let redux: { createStore: sinon.SinonStub }, store: any;
    let subject: any;

    before(() => {
        sandbox = sinon.createSandbox();

        redux = {createStore: sandbox.stub()}, store = {Store: sandbox.stub()};
        return rewiremock.around(
            () => import('../src/index'),
            (mock) => {
                mock.addPlugin(plugins.nodejs);
                mock('redux').with(redux);
                mock('../src/store').with(store);
            }
        ).then((result: any) => {
            subject = result;
        });
    });

    it('should call the createStore of the redux library, and return a Store object', () => {
        const testReducer = (): void => null;
        const test = {'test': 'test'};
        redux.createStore.returns(test);

        subject.createStore(testReducer);

        expect(redux.createStore.calledWith(testReducer)).to.be.true;
        expect(store.Store.calledWith(test)).to.be.true;
    });

    afterEach(() => {
        sandbox.reset();
    });

});
