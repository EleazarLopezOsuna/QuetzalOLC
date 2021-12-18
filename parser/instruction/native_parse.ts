import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console, _3dCode } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";

export class native_parse extends instruction {

    public translate(environment: environment): type {
        const dataType = this.value.translate(environment)
        const dataTemp = _3dCode.actualTemp;
        let savedEnvironment = 0;
        let resultTemp = 0;
        switch (this.native_type) {
            case type.INTEGER:
                _3dCode.actualTemp++;
                savedEnvironment = _3dCode.actualTemp;
                _3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                _3dCode.output += 'SP = 29;//Set StringToInt environment\n';
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 1;//Set string position\n';
                _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + dataTemp + ';//Save string\n';
                _3dCode.output += 'StringToInt();//Call function\n';
                _3dCode.actualTemp++;
                resultTemp = _3dCode.actualTemp;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                _3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                return type.INTEGER;
            case type.FLOAT:
                _3dCode.actualTemp++;
                savedEnvironment = _3dCode.actualTemp;
                _3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                _3dCode.output += 'SP = 29;//Set StringToInt environment\n';
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 1;//Set string position\n';
                _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + dataTemp + ';//Save string\n';
                _3dCode.output += 'StringToFloat();//Call function\n';
                _3dCode.actualTemp++;
                resultTemp = _3dCode.actualTemp;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                _3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                return type.FLOAT;
            case type.BOOLEAN:
                _3dCode.actualTag++
                const trueTag = _3dCode.actualTag;
                _3dCode.actualTag++
                const falseTag = _3dCode.actualTag;
                _3dCode.actualTag++
                const exitTag = _3dCode.actualTag;
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + '= HEAP[(int)T' + dataTemp + '];//Get character\n';
                _3dCode.output += 'if(T' + _3dCode.actualTemp + ' == 48) goto L' + trueTag + ';//Check if 0\n';
                _3dCode.output += 'goto L' + falseTag + ';\n';
                _3dCode.output += 'L' + trueTag + '://True tag\n';
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = 0;\n';
                _3dCode.output += 'goto L' + exitTag + ';\n';
                _3dCode.output += 'L' + falseTag + '://False tag\n';
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = 1;\n';
                _3dCode.output += 'goto L' + exitTag + ';\n';
                _3dCode.output += 'L' + exitTag + ':\n';
                return type.BOOLEAN;
        }
        return type.NULL
    }

    constructor(public native_type: type, public value: expression | literal, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        let value_data = this.value.execute(environment)
        switch (this.native_type) {
            case type.INTEGER:
                try {
                    return { value: parseInt(value_data.value), type: type.INTEGER }
                } catch (e) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede parsear a int el valor ' + value_data.value));
                }
            case type.FLOAT:
                try {
                    return { value: parseFloat(value_data.value), type: type.FLOAT }
                } catch (e) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede parsear a double el valor ' + value_data.value));
                }
            case type.BOOLEAN:
                try {
                    return { value: Boolean(value_data.value), type: type.BOOLEAN }
                } catch (e) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede parsear a boolean el valor ' + value_data.value));
                }
        }


        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Parse (" + type[this.native_type] + ")\"];";
        const this_count = count

        const child_list = [this.value]
        for (const instr of child_list) {
            if (instr != null) {
                try {
                    result += "node" + this_count + " -> " + "node" + count + "1;";
                    result += instr.plot(Number(count + "1"))
                    count++
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return result
    }
}