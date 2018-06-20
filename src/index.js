"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("./store");
var redux_1 = require("redux");
function createStore(reducers) {
    var store = redux_1.createStore(reducers);
    return new store_1.Store(store);
}
exports.createStore = createStore;
exports.default = createStore;
//# sourceMappingURL=index.js.map