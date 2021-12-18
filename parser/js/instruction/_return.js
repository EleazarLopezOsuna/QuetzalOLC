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
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Return\"];";
        const this_count = count;
        const child_list = [this.return_value];
        for (const instr of child_list) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                result += instr.plot(Number(count + "1"));
                count++;
            }
            catch (error) {
                console.log(error);
            }
        }
        return result;
    }
}
exports._return = _return;
//# sourceMappingURL=_return.js.map