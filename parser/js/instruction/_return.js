"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._return = void 0;
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
class _return extends instruction_1.instruction {
    constructor(return_value, line, column) {
        super(line, column);
        this.return_value = return_value;
    }
    translate(environment) {
        let returnType = this.return_value.translate(environment);
        console_1._3dCode.output += "goto L" + console_1._3dCode.breakTag + ";\n";
        return returnType;
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