"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._break = void 0;
const type_1 = require("../system/type");
const instruction_1 = require("../abstract/instruction");
class _break extends instruction_1.instruction {
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    constructor(line, column) {
        super(line, column);
    }
    execute(environment) {
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports._break = _break;
//# sourceMappingURL=_break.js.map