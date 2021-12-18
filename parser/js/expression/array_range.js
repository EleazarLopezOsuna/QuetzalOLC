"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array_range = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const literal_1 = require("../abstract/literal");
class array_range extends expression_1.expression {
    constructor(left, right, line, column) {
        super(line, column);
        this.left = left;
        this.right = right;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        const left_data = (typeof this.left != 'string') ? this.left.execute(environment) : { type: type_1.type.STRING, value: this.left };
        const right_data = (typeof this.right != 'string') ? this.right.execute(environment) : { type: type_1.type.STRING, value: this.right };
        if (left_data.type != type_1.type.INTEGER && left_data.value != 'begin') {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Inicio de rango no valido: ' + left_data.value));
            return { value: null, type: type_1.type.NULL };
        }
        if (right_data.type != type_1.type.INTEGER && right_data.value != 'end') {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Fin de rango no valido: ' + right_data.value));
            return { value: null, type: type_1.type.NULL };
        }
        if (left_data.type == type_1.type.INTEGER && right_data.type == type_1.type.INTEGER && left_data.value >= right_data.value) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Inicio del rango tiene que ser mayor que el final'));
            return { value: null, type: type_1.type.NULL };
        }
        // Default
        return { value: [left_data.value, right_data.value], type: type_1.type.INTEGER };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Rango de Array\"];";
        const this_count = count;
        const child_list = [this.left, this.right];
        for (const instr of child_list) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                if (instr instanceof expression_1.expression || instr instanceof literal_1.literal) {
                    result += instr.plot(Number(count + "1"));
                }
                else {
                    result += "node" + Number(count + "1") + "[label=\"(" + this.line + "," + this.column + ") " + instr + "\"];";
                }
                count++;
            }
            catch (error) {
                console.log(error);
            }
        }
        return result;
    }
}
exports.array_range = array_range;
//# sourceMappingURL=array_range.js.map