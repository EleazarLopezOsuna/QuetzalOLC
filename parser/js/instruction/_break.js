"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._break = void 0;
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
class _break extends instruction_1.instruction {
    translate(environment) {
        console_1._3dCode.output += "goto L" + console_1._3dCode.breakTag + ";\n";
        return type_1.type.NULL;
    }
    constructor(line, column) {
        super(line, column);
    }
    execute(environment) {
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Break\"];";
        return result;
    }
}
exports._break = _break;
//# sourceMappingURL=_break.js.map