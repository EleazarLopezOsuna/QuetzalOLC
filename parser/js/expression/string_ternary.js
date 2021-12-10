"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.string_ternary = exports.string_ternary_type = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
var string_ternary_type;
(function (string_ternary_type) {
    string_ternary_type[string_ternary_type["SUBSTRING"] = 0] = "SUBSTRING";
})(string_ternary_type = exports.string_ternary_type || (exports.string_ternary_type = {}));
class string_ternary extends expression_1.expression {
    constructor(first, second, third, type, line, column) {
        super(line, column);
        this.first = first;
        this.second = second;
        this.third = third;
        this.type = type;
    }
    translate(environment) {
        const firstType = this.first.translate(environment);
        const firstTemp = console_1._3dCode.actualTemp;
        const secondType = this.second.translate(environment);
        const secondTemp = console_1._3dCode.actualTemp;
        const thirdType = this.third.translate(environment);
        const thirdTemp = console_1._3dCode.actualTemp;
        switch (this.type) {
            case string_ternary_type.SUBSTRING:
                if (firstType == type_1.type.STRING && secondType == type_1.type.INTEGER && thirdType == type_1.type.INTEGER) {
                    console_1._3dCode.actualTemp++;
                    const savedEnvironment = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                    console_1._3dCode.output += 'SP = 23;//Set StringExtract environment\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set string position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + firstTemp + ';//Save string\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 2;//Set start position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + secondTemp + ';//Save start position\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 3;//Set end position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + thirdTemp + ';//Save end position\n';
                    console_1._3dCode.output += 'StringExtract();//Call function\n';
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
        const first_data = this.first.execute(environment);
        const second_data = this.second.execute(environment);
        const third_data = this.third.execute(environment);
        switch (this.type) {
            case string_ternary_type.SUBSTRING:
                if (first_data.type == type_1.type.STRING && second_data.type == type_1.type.INTEGER && third_data.type == type_1.type.INTEGER) {
                    let string_return = first_data.value.toString();
                    return { value: string_return.substr(second_data.value, third_data.value), type: type_1.type.STRING };
                }
                else {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar substring ' + first_data.value + ' & ' + second_data.value + ' & ' + third_data.value));
                }
                break;
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.string_ternary = string_ternary;
//# sourceMappingURL=string_ternary.js.map