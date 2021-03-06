"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const environment_1 = require("../system/environment");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
class main extends instruction_1.instruction {
    constructor(code, line, column) {
        super(line, column);
        this.code = code;
    }
    translate(current_environment) {
        console_1._3dCode.output = 'void main(){\n' + 'SP = ' + console_1._3dCode.absolutePos + ';\n' + 'mainStart = ' + console_1._3dCode.absolutePos + ';\n' + console_1._3dCode.output;
        let main_environment = new environment_1.environment(current_environment);
        main_environment.name = 'main';
        console_1._3dCode.environmentList.push(main_environment);
        this.code.forEach(element => {
            element.translate(main_environment);
        });
        console_1._3dCode.output += 'return;\n';
        console_1._3dCode.output += '}\n';
        return type_1.type.NULL;
    }
    execute(current_environment) {
        const new_environment = new environment_1.environment(current_environment);
        this.code.forEach(element => {
            element.execute(new_environment);
        });
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Main\"];";
        const this_count = count;
        for (const instr of this.code) {
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
exports.main = main;
//# sourceMappingURL=main.js.map