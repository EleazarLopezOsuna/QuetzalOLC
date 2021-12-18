"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._if = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
const _return_1 = require("./_return");
class _if extends instruction_1.instruction {
    constructor(condition, code, else_statement, line, column) {
        super(line, column);
        this.condition = condition;
        this.code = code;
        this.else_statement = else_statement;
    }
    translate(environment) {
        this.condition.translate(environment);
        const conditionTemp = console_1._3dCode.actualTemp;
        console_1._3dCode.actualTag++;
        let lTrue = console_1._3dCode.actualTag;
        console_1._3dCode.output += "if(T" + conditionTemp + ") goto L" + lTrue + ";\n";
        console_1._3dCode.actualTag++;
        let lFalse = console_1._3dCode.actualTag;
        console_1._3dCode.output += "goto L" + lFalse + ";\n";
        console_1._3dCode.actualTag++;
        let salida = console_1._3dCode.actualTag;
        console_1._3dCode.output += "L" + lTrue + ":\n";
        for (const instr of this.code) {
            try {
                instr.translate(environment);
            }
            catch (error) {
                console.log(error);
            }
        }
        console_1._3dCode.output += "goto L" + salida + ";\n";
        console_1._3dCode.output += "L" + lFalse + ":\n";
        if (this.else_statement != null)
            if (this.else_statement instanceof instruction_1.instruction) {
                this.else_statement.translate(environment);
            }
            else if (this.else_statement instanceof Array) {
                for (const instr of this.else_statement) {
                    try {
                        instr.translate(environment);
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }
        console_1._3dCode.output += "L" + salida + ":\n";
        return type_1.type.NULL;
    }
    execute(environment) {
        const condition = this.condition.execute(environment);
        // first check that the condition is a boolean
        if (condition.type != type_1.type.BOOLEAN) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'La condicion del if tiene que ser booleana'));
        }
        // if the condition is true execute the set of instructions
        if (condition.value == true) {
            for (const instr of this.code) {
                try {
                    const element_data = instr.execute(environment);
                    if (instr instanceof _return_1._return) {
                        return element_data;
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
        else {
            // else if is another if
            if (this.else_statement instanceof instruction_1.instruction) {
                return this.else_statement.execute(environment);
            }
            // Else without condition is just a set of instructions 
            else if (this.else_statement instanceof Array) {
                for (const instr of this.else_statement) {
                    try {
                        const element_data = instr.execute(environment);
                        if (instr instanceof _return_1._return) {
                            return element_data;
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }
        }
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") For\"];";
        const this_count = count;
        const child_list = [this.condition];
        const arr_list = [this.code];
        if (this.else_statement instanceof instruction_1.instruction) {
            child_list.push(this.else_statement);
        }
        else {
            arr_list.push(this.else_statement);
        }
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
exports._if = _if;
//# sourceMappingURL=_if.js.map