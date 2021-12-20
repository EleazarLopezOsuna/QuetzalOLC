"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declaration_function = void 0;
const environment_1 = require("../system/environment");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
const _return_1 = require("./_return");
class declaration_function extends instruction_1.instruction {
    constructor(native_type, id, parameters, code, line, column) {
        super(line, column);
        this.native_type = native_type;
        this.id = id;
        this.parameters = parameters;
        this.code = code;
        this.functionEnvironment = new environment_1.environment(null);
    }
    translate(env) {
        let return_data;
        let paramName;
        this.functionEnvironment = new environment_1.environment(env);
        const savedPreviousCode = console_1._3dCode.output;
        console_1._3dCode.output = '';
        switch (this.native_type) {
            case type_1.type.INTEGER:
            case type_1.type.STRING:
            case type_1.type.CHAR:
            case type_1.type.BOOLEAN:
            case type_1.type.FLOAT:
            default:
                console_1._3dCode.output += 'void ' + this.id + '(){\n';
                break;
        }
        let size = 0;
        console_1._3dCode.actualTemp++;
        const savedRelative = console_1._3dCode.relativePos;
        console_1._3dCode.relativePos = 0;
        env.save_variable(this.id, { value: null, type: this.native_type }, console_1._3dCode.absolutePos, console_1._3dCode.absolutePos, size);
        this.functionEnvironment.save_variable('return', { value: null, type: this.native_type }, console_1._3dCode.absolutePos, console_1._3dCode.relativePos, 1);
        console_1._3dCode.relativePos++;
        console_1._3dCode.absolutePos++;
        size++;
        this.parameters.forEach(param => {
            return_data = param.execute(this.functionEnvironment);
            paramName = return_data.value;
            this.functionEnvironment.save_variable(paramName, return_data, console_1._3dCode.absolutePos, console_1._3dCode.relativePos, 1);
            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + ' + console_1._3dCode.relativePos + ';//Setting position for parameter ' + paramName + '\n';
            console_1._3dCode.relativePos++;
            console_1._3dCode.absolutePos++;
            size++;
        });
        this.code.forEach(instr => {
            if (instr instanceof _return_1._return) {
                return_data = instr.translate(this.functionEnvironment);
                return;
            }
            else {
                instr.translate(this.functionEnvironment);
            }
        });
        console_1._3dCode.relativePos = savedRelative;
        console_1._3dCode.output += 'return;\n';
        console_1._3dCode.output += '}\n\n';
        console_1._3dCode.functionsCode += console_1._3dCode.output;
        console_1._3dCode.output = savedPreviousCode;
        return type_1.type.NULL;
    }
    execute(environment) {
        environment.save_function(this.id, this, 0, 0, 0);
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Declaracion de Funcion (" + this.id + "," + type_1.type[this.native_type] + ")\"];";
        const this_count = count;
        const arr_list = [this.parameters, this.code];
        for (const instr_arr of arr_list) {
            for (const instr of instr_arr) {
                try {
                    result += "node" + this_count + " -> " + "node" + count + "1;";
                    result += instr.plot(Number(count + "1"));
                    count++;
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
        return result;
    }
}
exports.declaration_function = declaration_function;
//# sourceMappingURL=declaration_function.js.map