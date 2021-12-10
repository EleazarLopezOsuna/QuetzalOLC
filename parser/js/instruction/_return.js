"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._return = void 0;
const instruction_1 = require("../abstract/instruction");
class _return extends instruction_1.instruction {
    constructor(return_value, line, column) {
        super(line, column);
        this.return_value = return_value;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        return this.return_value.execute(environment);
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports._return = _return;
//# sourceMappingURL=_return.js.map