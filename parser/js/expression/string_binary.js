"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.string_binary = exports.string_binary_type = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
var string_binary_type;
(function (string_binary_type) {
    string_binary_type[string_binary_type["CONCAT"] = 0] = "CONCAT";
    string_binary_type[string_binary_type["REPEAT"] = 1] = "REPEAT";
    string_binary_type[string_binary_type["POSITION"] = 2] = "POSITION";
})(string_binary_type = exports.string_binary_type || (exports.string_binary_type = {}));
class string_binary extends expression_1.expression {
    constructor(left, right, type, line, column) {
        super(line, column);
        this.left = left;
        this.right = right;
        this.type = type;
    }
    translate(environment) {
        const leftType = this.left.translate(environment);
        const leftTemp = console_1._3dCode.actualTemp;
        const rightType = this.right.translate(environment);
        const rightTemp = console_1._3dCode.actualTemp;
        switch (this.type) {
            case string_binary_type.CONCAT:
                if (leftType == type_1.type.STRING && rightType == type_1.type.STRING) {
                    console_1._3dCode.actualTemp++;
                    const savedEnvironment = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                    console_1._3dCode.output += 'SP = 0;//Set StringConcat environment\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set first String position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + leftTemp + ';//Save string\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 2;//Set second String position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + rightTemp + ';//Save position\n';
                    console_1._3dCode.output += 'StringConcat();//Call function\n';
                    console_1._3dCode.actualTemp++;
                    const resultTemp = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                    console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                    return type_1.type.STRING;
                }
                else {
                }
                break;
            case string_binary_type.REPEAT:
                if (leftType == type_1.type.STRING && rightType == type_1.type.INTEGER) {
                    console_1._3dCode.actualTemp++;
                    const savedEnvironment = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                    console_1._3dCode.output += 'SP = 8;//Set StringConcat environment\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set first String position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + leftTemp + ';//Save string\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 2;//Set second String position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + rightTemp + ';//Save position\n';
                    console_1._3dCode.output += 'StringTimes();//Call function\n';
                    console_1._3dCode.actualTemp++;
                    const resultTemp = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                    console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                    return type_1.type.STRING;
                }
                else {
                }
                break;
            case string_binary_type.POSITION:
                if (leftType == type_1.type.STRING && rightType == type_1.type.INTEGER) {
                    console_1._3dCode.actualTemp++;
                    const savedEnvironment = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                    console_1._3dCode.output += 'SP = 20;//Set StringPosition environment\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set String position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + leftTemp + ';//Save string\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 2;//Set String position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + rightTemp + ';//Save position\n';
                    console_1._3dCode.output += 'StringPosition();//Call function\n';
                    console_1._3dCode.actualTemp++;
                    const resultTemp = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                    console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                    return type_1.type.STRING;
                }
                else {
                }
                break;
        }
        // Default
        return type_1.type.NULL;
    }
    execute(environment) {
        const left_data = this.left.execute(environment);
        const right_data = this.right.execute(environment);
        switch (this.type) {
            case string_binary_type.CONCAT:
                if (left_data.type == type_1.type.STRING && right_data.type == type_1.type.STRING) {
                    return { value: (left_data.value.toString() + right_data.value.toString()), type: type_1.type.STRING };
                }
                else {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.value + ' & ' + right_data.value));
                }
                break;
            case string_binary_type.REPEAT:
                if (left_data.type == type_1.type.STRING && right_data.type == type_1.type.INTEGER) {
                    let return_value = "";
                    for (let index = 0; index < right_data.value; index++) {
                        return_value += left_data.value;
                    }
                    return { value: return_value, type: type_1.type.STRING };
                }
                else {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.value + ' ^ ' + right_data.value));
                }
                break;
            case string_binary_type.POSITION:
                if (left_data.type == type_1.type.STRING && right_data.type == type_1.type.INTEGER) {
                    let string_value = left_data.value.toString();
                    try {
                        return { value: string_value.charAt(right_data.value), type: type_1.type.STRING };
                    }
                    catch (err) {
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.value + ' caracterOfPosition ' + right_data.value));
                    }
                }
                else {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.value + ' caracterOfPosition ' + right_data.value));
                }
                break;
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") String binario (" + string_binary_type[this.type] + ")\"];";
        const this_count = count;
        const child_list = [this.left, this.right];
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
exports.string_binary = string_binary;
//# sourceMappingURL=string_binary.js.map