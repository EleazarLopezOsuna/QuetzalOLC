"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._return = void 0;
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
class _return extends instruction_1.instruction {
    constructor(return_value, line, column) {
        super(line, column);
        this.return_value = return_value;
    }
    translate(environment) {
        if (this.return_value != null) {
            let returnType = this.return_value.translate(environment);
            let returnTemp = console_1._3dCode.actualTemp;
            console_1._3dCode.actualTemp++;
            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
            console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + returnTemp + ';//Save return value\n';
            console_1._3dCode.output += 'return;\n';
            return returnType;
        }
        return type_1.type.NULL;
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