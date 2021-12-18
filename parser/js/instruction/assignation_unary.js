"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignation_unary = void 0;
const instruction_1 = require("../abstract/instruction");
const console_1 = require("../system/console");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
class assignation_unary extends instruction_1.instruction {
    constructor(id, expr, line, column) {
        super(line, column);
        this.id = id;
        this.expr = expr;
    }
    translate(environment) {
        const exprType = this.expr.translate(environment);
        // validate that exists
        let saved_variable = environment.get_variable(this.id);
        let absolutePos = environment.get_absolute(this.id);
        if (saved_variable.type != type_1.type.UNDEFINED) {
            // validate the type
            if (saved_variable.type == exprType) {
                // assign the value
                console_1._3dCode.output += 'STACK[' + absolutePos + '] = T' + console_1._3dCode.actualTemp + ';//Update value for variable ' + this.id + '\n';
            }
            else {
            }
        }
        else {
        }
        // Default
        return type_1.type.NULL;
    }
    execute(environment) {
        const expr_data = this.expr.execute(environment);
        // validate that exists
        let saved_variable = environment.get_variable(this.id);
        if (saved_variable.type != type_1.type.UNDEFINED) {
            // validate the type
            if (saved_variable.type == expr_data.type) {
                // assign the value
                let absolutePos = environment.get_absolute(this.id);
                let relativePos = environment.get_relative(this.id);
                let size = environment.get_size(this.id);
                environment.save_variable(this.id, expr_data, absolutePos, relativePos, size);
            }
            else {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Tipo diferente, no se puede asignar'));
            }
        }
        else {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable no inicializada'));
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Assignacion Unaria (" + this.id + ")\"];";
        const this_count = count;
        const child_list = [this.expr];
        for (const instr of child_list) {
            if (instr != null) {
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
exports.assignation_unary = assignation_unary;
//# sourceMappingURL=assignation_unary.js.map