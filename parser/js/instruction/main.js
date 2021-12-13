"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
class main extends instruction_1.instruction {
    constructor(code, line, column) {
        super(line, column);
        this.code = code;
    }
    translate(environment) {
        console_1._3dCode.output += 'void main(){\n';
        this.code.forEach(element => {
            element.translate(environment);
        });
        console_1._3dCode.output += 'return;\n';
        console_1._3dCode.output += '}\n';
        return type_1.type.NULL;
    }
    execute(environment) {
        this.code.forEach(element => {
            element.execute(environment);
        });
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.main = main;
//# sourceMappingURL=main.js.map