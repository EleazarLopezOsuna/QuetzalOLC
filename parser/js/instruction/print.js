"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.print = exports.print_type = void 0;
const instruction_1 = require("../abstract/instruction");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const _array_1 = require("../literal/_array");
const struct_item_1 = require("../literal/struct_item");
const variable_id_1 = require("../literal/variable_id");
var print_type;
(function (print_type) {
    print_type[print_type["PRINT"] = 0] = "PRINT";
    print_type[print_type["PRINTLN"] = 1] = "PRINTLN";
})(print_type = exports.print_type || (exports.print_type = {}));
class print extends instruction_1.instruction {
    constructor(expresions, type, line, column) {
        super(line, column);
        this.expresions = expresions;
        this.type = type;
    }
    translate(environment) {
        this.expresions.forEach(element => {
            let expr_data = null;
            if (element instanceof variable_id_1.variable_id) {
                expr_data = element.execute(environment);
            }
            if (expr_data != null && expr_data.value instanceof _array_1._array) {
                let size = expr_data.value.size;
                let varId = element;
                let start = environment.get_relative_recursive(varId.id, environment);
                console_1._3dCode.actualTemp++;
                let startTemp = console_1._3dCode.actualTemp;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + ' + start + ';\n';
                let varType = environment.get_variable_recursive(varId.id, environment).type;
                let tipo;
                switch (varType) {
                    case type_1.type.CHAR:
                    case type_1.type.STRING:
                        tipo = 0;
                        break;
                    case type_1.type.BOOLEAN:
                    case type_1.type.INTEGER:
                        tipo = 1;
                        break;
                    case type_1.type.FLOAT:
                        tipo = 2;
                        break;
                }
                console_1._3dCode.actualTemp++;
                let savedEnvironment = console_1._3dCode.actualTemp;
                console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'SP = 39;\n';
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;\n';
                console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = ' + size + ';\n';
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 2;\n';
                console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + startTemp + ';\n';
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 3;\n';
                console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = ' + tipo + ';\n';
                console_1._3dCode.output += 'printArray();\n';
                console_1._3dCode.output += 'SP = T' + savedEnvironment + ';\n';
            }
            else if (expr_data != null && expr_data.value instanceof struct_item_1.struct_item) {
            }
            else {
                const elementType = element.translate(environment);
                switch (elementType) {
                    case type_1.type.BOOLEAN:
                        console_1._3dCode.actualTag++;
                        const trueTag = console_1._3dCode.actualTag;
                        console_1._3dCode.actualTag++;
                        const falseTag = console_1._3dCode.actualTag;
                        console_1._3dCode.actualTag++;
                        const exitTag = console_1._3dCode.actualTag;
                        console_1._3dCode.output += 'if(T' + console_1._3dCode.actualTemp + ' == 0) goto L' + trueTag + ';//Check if False\n';
                        console_1._3dCode.output += 'goto L' + falseTag + ';\n';
                        console_1._3dCode.output += 'L' + trueTag + '://True tag\n';
                        console_1._3dCode.output += 'printf("%c", 70);//Print F\n';
                        console_1._3dCode.output += 'printf("%c", 97);//Print a\n';
                        console_1._3dCode.output += 'printf("%c", 108);//Print l\n';
                        console_1._3dCode.output += 'printf("%c", 115);//Print s\n';
                        console_1._3dCode.output += 'printf("%c", 101);//Print e\n';
                        console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                        console_1._3dCode.output += 'L' + falseTag + '://True tag\n';
                        console_1._3dCode.output += 'printf("%c", 84);//Print T\n';
                        console_1._3dCode.output += 'printf("%c", 114);//Print r\n';
                        console_1._3dCode.output += 'printf("%c", 117);//Print u\n';
                        console_1._3dCode.output += 'printf("%c", 101);//Print e\n';
                        console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                        console_1._3dCode.output += 'L' + exitTag + ':\n';
                        break;
                    case type_1.type.CHAR:
                    case type_1.type.STRING:
                        const elementTemp = console_1._3dCode.actualTemp;
                        console_1._3dCode.actualTemp++;
                        const savedEnvironment = console_1._3dCode.actualTemp;
                        console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                        console_1._3dCode.output += 'SP = 3;//Set StringPrint environment\n';
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = ' + 'SP + 0;//Set string position\n';
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + elementTemp + ';//Save string\n';
                        console_1._3dCode.output += 'StringPrint();//Call function\n';
                        console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                        break;
                    case type_1.type.INTEGER:
                        console_1._3dCode.output += 'printf("%d", (int)T' + console_1._3dCode.actualTemp + ');//Print integer\n';
                        break;
                    case type_1.type.FLOAT:
                        console_1._3dCode.output += 'printf("%f", T' + console_1._3dCode.actualTemp + ');//Print float\n';
                        break;
                    default:
                        console.log(elementType);
                        break;
                }
            }
        });
        switch (this.type) {
            case print_type.PRINTLN:
                console_1._3dCode.output += 'printf("%c", 10);//Print new line\n';
                break;
        }
        return type_1.type.NULL;
    }
    execute(environment) {
        this.expresions.forEach(element => {
            const expr_data = element.execute(environment);
            let print_str = expr_data.value;
            // if is an array or a struct convert to string first 
            if (expr_data.value instanceof _array_1._array || expr_data.value instanceof struct_item_1.struct_item) {
                print_str = expr_data.value.to_string(environment);
            }
            switch (this.type) {
                case print_type.PRINT:
                    console_1._console.output += print_str;
                    break;
                case print_type.PRINTLN:
                    console_1._console.output += print_str + "\n";
                    break;
            }
        });
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Print (" + print_type[this.type] + ")\"];";
        const this_count = count;
        const arr_list = [this.expresions];
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
exports.print = print;
//# sourceMappingURL=print.js.map