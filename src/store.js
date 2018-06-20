"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
var Store = (function (_super) {
    __extends(Store, _super);
    function Store(store) {
        var _this = _super.call(this) || this;
        _this.source = new Observable_1.Observable(function (observer) {
            observer.next(store.getState());
            return store.subscribe(function () {
                observer.next(store.getState());
            });
        });
        return _this;
    }
    return Store;
}(Observable_1.Observable));
exports.Store = Store;
//# sourceMappingURL=store.js.map