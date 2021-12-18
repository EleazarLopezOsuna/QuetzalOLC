"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.native_function = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
class native_function extends instruction_1.instruction {
    constructor(option, value, line, column) {
        super(line, column);
        this.option = option;
        this.value = value;
    }
    translate(environment) {
        let dataType = this.value.translate(environment);
        const dataTemp = console_1._3dCode.actualTemp;
        let savedEnvironment = 0;
        let resultTemp = 0;
        let numero = 0;
        let entero = 0;
        let flotante = 0;
        switch (this.option) {
            case "toInt":
                if (dataType == type_1.type.FLOAT) {
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = (int)T' + dataTemp + ';//Change value to int\n';
                    return type_1.type.INTEGER;
                }
                else if (dataType == type_1.type.STRING) {
                    console_1._3dCode.actualTemp++;
                    savedEnvironment = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                    console_1._3dCode.output += 'SP = 29;//Set StringToInt environment\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set string position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + dataTemp + ';//Save string\n';
                    console_1._3dCode.output += 'StringToInt();//Call function\n';
                    console_1._3dCode.actualTemp++;
                    resultTemp = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                    console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                    return type_1.type.INTEGER;
                }
            case "toDouble":
                if (dataType == type_1.type.INTEGER) {
                    return type_1.type.FLOAT;
                }
                else if (dataType == type_1.type.STRING) {
                    console_1._3dCode.actualTemp++;
                    savedEnvironment = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                    console_1._3dCode.output += 'SP = 29;//Set StringToInt environment\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set string position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + dataTemp + ';//Save string\n';
                    console_1._3dCode.output += 'StringToFloat();//Call function\n';
                    console_1._3dCode.actualTemp++;
                    resultTemp = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                    console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                    return type_1.type.FLOAT;
                }
            case "string":
                console_1._3dCode.actualTemp++;
                savedEnvironment = console_1._3dCode.actualTemp;
                if (dataType == type_1.type.FLOAT) {
                    console_1._3dCode.actualTemp++;
                    numero = console_1._3dCode.actualTemp;
                    console_1._3dCode.actualTemp++;
                    entero = console_1._3dCode.actualTemp;
                    console_1._3dCode.actualTemp++;
                    flotante = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + numero + ' = T' + dataTemp + ';//Get value\n';
                    console_1._3dCode.output += 'T' + entero + ' = (int)T' + numero + ';//Get integer part\n';
                    console_1._3dCode.output += 'T' + flotante + ' = T' + numero + ' - T' + entero + ';//Get float part\n';
                    console_1._3dCode.output += 'T' + flotante + ' = T' + flotante + ' * 100000000;//Get float as integer\n';
                    console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                    console_1._3dCode.output += 'SP = 33;//Set floatToString environment\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set integer part position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + entero + ';//Save integer part\n';
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 2;//Set float part position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + flotante + ';//Save float part\n';
                    console_1._3dCode.output += 'floatToString();//Call function\n';
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + console_1._3dCode.actualTemp + '];//Get return value\n';
                    console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Get environment back\n';
                    return type_1.type.STRING;
                }
                else if (dataType == type_1.type.INTEGER) {
                    console_1._3dCode.actualTemp++;
                    numero = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + numero + ' = T' + dataTemp + ';//Get value\n';
                    console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                    console_1._3dCode.output += 'SP = 14;//Set intToString environment\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + numero + ';//Save value\n';
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = HP;//Save start position of string\n';
                    console_1._3dCode.output += 'intToString();//Call function\n';
                    console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Get environment back\n';
                    return type_1.type.STRING;
                }
                else if (dataType == type_1.type.CHAR) {
                    return type_1.type.CHAR;
                }
                return type_1.type.STRING;
            case "typeof":
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                console_1._3dCode.output += 'SP = 27;//Set StringConcat environment\n';
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set number position\n';
                switch (dataType) {
                    case type_1.type.STRING:
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = 0;//Save number\n';
                        break;
                    case type_1.type.INTEGER:
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = 1;//Save number\n';
                        break;
                    case type_1.type.FLOAT:
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = 2;//Save number\n';
                        break;
                    case type_1.type.CHAR:
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = 3;//Save number\n';
                        break;
                    case type_1.type.BOOLEAN:
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = 4;//Save number\n';
                        break;
                    case type_1.type.NULL:
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = 6;//Save number\n';
                        break;
                    default:
                        console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = 5;//Save number\n';
                        break;
                }
                console_1._3dCode.output += 'getTypeOf();//Call function\n';
                console_1._3dCode.actualTemp++;
                resultTemp = console_1._3dCode.actualTemp;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                return type_1.type.STRING;
        }
        return type_1.type.NULL;
    }
    execute(environment) {
        let value_data = this.value.execute(environment);
        switch (this.option) {
            case "toInt":
                try {
                    return { value: parseInt(value_data.value), type: type_1.type.INTEGER };
                }
                catch (e) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede parsear a int el valor ' + value_data.value));
                }
            case "toDouble":
                try {
                    return { value: parseFloat(value_data.value), type: type_1.type.FLOAT };
                }
                catch (e) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede parsear a double el valor ' + value_data.value));
                }
            case "string":
                try {
                    return { value: String(value_data.value), type: type_1.type.STRING };
                }
                catch (e) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede parsear a string el valor ' + value_data.value));
                }
            case "typeof":
                return { value: type_1.type[value_data.type], type: type_1.type.STRING };
        }
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Funcion Nativa (" + this.option + ")\"];";
        const this_count = count;
        const child_list = [this.value];
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
exports.native_function = native_function;
//# sourceMappingURL=native_function.js.map