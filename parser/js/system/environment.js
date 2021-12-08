"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const _symbol_1 = require("./_symbol");
class environment {
    constructor(previous) {
        this.previous = previous;
        this.previous = previous;
        this.variable_map = new Map();
        this.function_map = new Map();
    }
    save_variable(id, data) {
        let symbol_type = _symbol_1.scope.LOCAL;
        if (this.previous == null) {
            symbol_type = _symbol_1.scope.GLOBAL;
        }
        this.variable_map.set(id, new _symbol_1._symbol(id, data, symbol_type));
    }
}
exports.environment = environment;
//# sourceMappingURL=environment.js.map