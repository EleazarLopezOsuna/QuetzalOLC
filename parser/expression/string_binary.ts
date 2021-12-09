import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _3dCode, _console } from "../system/console";

export enum string_binary_type {
    CONCAT,
    REPEAT,
    POSITION,
}

export class string_binary extends expression {
    public translate(environment: environment): type {
        const leftType = this.left.translate(environment);
        const leftTemp = _3dCode.actualTemp;
        const rightType = this.right.translate(environment);
        const rightTemp = _3dCode.actualTemp;

        switch (this.type) {
            case string_binary_type.CONCAT:
                if (leftType == type.STRING && rightType == type.STRING) {
                    return type.STRING;
                } else {
                    
                }
                break;
            case string_binary_type.REPEAT:
                if (leftType == type.STRING && rightType == type.INTEGER) {

                    return type.STRING;
                } else {
                    
                }
                break;
            case string_binary_type.POSITION:
                if (leftType == type.STRING && rightType == type.INTEGER) {
                    _3dCode.actualTemp++;
                    const savedEnvironment = _3dCode.actualTemp;
                    _3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                    _3dCode.output += 'SP = 20;//Set StringPosition environment\n';
                    _3dCode.actualTemp++;
                    _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 1;//Set String position\n';
                    _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + leftTemp + ';//Save string\n';
                    _3dCode.actualTemp++;
                    _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 2;//Set String position\n';
                    _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + rightTemp + ';//Save position\n';
                    _3dCode.output += 'StringPosition();//Call function\n';
                    _3dCode.actualTemp++;
                    const resultTemp = _3dCode.actualTemp;
                    _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                    _3dCode.actualTemp++;
                    _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                    _3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                    return type.STRING;
                } else {
                    
                }
                break;
        }
        // Default
        return type.NULL;
    }

    constructor(public left: expression, public right: expression, public type: string_binary_type, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const left_data = this.left.execute(environment);
        const right_data = this.right.execute(environment);

        switch (this.type) {
            case string_binary_type.CONCAT:
                if (left_data.type == type.STRING && right_data.type == type.STRING) {
                    return { value: (left_data.value.toString() + right_data.value.toString()), type: type.STRING };
                } else {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.value + ' & ' + right_data.value));
                }
                break;
            case string_binary_type.REPEAT:
                if (left_data.type == type.STRING && right_data.type == type.INTEGER) {
                    let return_value = ""
                    for (let index = 0; index < right_data.value; index++) {
                        return_value += left_data.value
                    }
                    return { value: return_value, type: type.STRING };
                } else {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.value + ' ^ ' + right_data.value));
                }
                break;
            case string_binary_type.POSITION:
                if (left_data.type == type.STRING && right_data.type == type.INTEGER) {
                    let string_value: String = left_data.value.toString();
                    try {
                        return { value: string_value.charAt(right_data.value), type: type.STRING };
                    } catch (err) {
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.value + ' caracterOfPosition ' + right_data.value));
                    }
                } else {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.value + ' caracterOfPosition ' + right_data.value));
                }
                break;
        }
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}