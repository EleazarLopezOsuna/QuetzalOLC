"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.native_parse = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
class native_parse extends instruction_1.instruction {
    constructor(native_type, value, line, column) {
        super(line, column);
        this.native_type = native_type;
        this.value = value;
    }
    translate(environment) {
        const dataType = this.value.translate(environment);
        const dataTemp = console_1._3dCode.actualTemp;
        let savedEnvironment = 0;
        let resultTemp = 0;
        switch (this.native_type) {
            case type_1.type.INTEGER:
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
            case type_1.type.FLOAT:
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
            case type_1.type.BOOLEAN:
                console_1._3dCode.actualTag++;
                const trueTag = console_1._3dCode.actualTag;
                console_1._3dCode.actualTag++;
                const falseTag = console_1._3dCode.actualTag;
                console_1._3dCode.actualTag++;
                const exitTag = console_1._3dCode.actualTag;
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + '= HEAP[(int)T' + dataTemp + '];//Get character\n';
                console_1._3dCode.output += 'if(T' + console_1._3dCode.actualTemp + ' == 48) goto L' + trueTag + ';//Check if 0\n';
                console_1._3dCode.output += 'goto L' + falseTag + ';\n';
                console_1._3dCode.output += 'L' + trueTag + '://True tag\n';
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = 0;\n';
                console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                console_1._3dCode.output += 'L' + falseTag + '://False tag\n';
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = 1;\n';
                console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                console_1._3dCode.output += 'L' + exitTag + ':\n';
                return type_1.type.BOOLEAN;
        }
        return type_1.type.NULL;
    }
    execute(environment) {
        let value_data = this.value.execute(environment);
        switch (this.native_type) {
            case type_1.type.INTEGER:
                try {
                    return { value: parseInt(value_data.value), type: type_1.type.INTEGER };
                }
                catch (e) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede parsear a int el valor ' + value_data.value));
                }
            case type_1.type.FLOAT:
                try {
                    return { value: parseFloat(value_data.value), type: type_1.type.FLOAT };
                }
                catch (e) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede parsear a double el valor ' + value_data.value));
                }
            case type_1.type.BOOLEAN:
                try {
                    return { value: Boolean(value_data.value), type: type_1.type.BOOLEAN };
                }
                catch (e) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede parsear a boolean el valor ' + value_data.value));
                }
        }
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Parse (" + type_1.type[this.native_type] + ")\"];";
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
exports.native_parse = native_parse;
//# sourceMappingURL=native_parse.js.map