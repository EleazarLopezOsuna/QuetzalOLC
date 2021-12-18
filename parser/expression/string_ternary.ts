import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _3dCode } from "../system/console";

export enum string_ternary_type {
    SUBSTRING,
}

export class string_ternary extends expression {
    public translate(environment: environment): type {
        const firstType = this.first.translate(environment);
        const firstTemp = _3dCode.actualTemp;
        const secondType = this.second.translate(environment);
        const secondTemp = _3dCode.actualTemp;
        const thirdType = this.third.translate(environment);
        const thirdTemp = _3dCode.actualTemp;

        switch (this.type) {
            case string_ternary_type.SUBSTRING:
                if (firstType == type.STRING && secondType == type.INTEGER && thirdType == type.INTEGER) {
                    _3dCode.actualTemp++;
                    const savedEnvironment = _3dCode.actualTemp;
                    _3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                    _3dCode.output += 'SP = 23;//Set StringExtract environment\n';
                    _3dCode.actualTemp++;
                    _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 1;//Set string position\n';
                    _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + firstTemp + ';//Save string\n';
                    _3dCode.actualTemp++;
                    _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 2;//Set start position\n';
                    _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + secondTemp + ';//Save start position\n';
                    _3dCode.actualTemp++;
                    _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 3;//Set end position\n';
                    _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + thirdTemp + ';//Save end position\n';
                    _3dCode.output += 'StringExtract();//Call function\n';
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
        return type.NULL
    }

    constructor(public first: expression, public second: expression, public third: expression, public type: string_ternary_type, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const first_data = this.first.execute(environment);
        const second_data = this.second.execute(environment);
        const third_data = this.third.execute(environment);

        switch (this.type) {
            case string_ternary_type.SUBSTRING:
                if (first_data.type == type.STRING && second_data.type == type.INTEGER && third_data.type == type.INTEGER) {
                    let string_return: String = first_data.value.toString()
                    return { value: string_return.substr(second_data.value, third_data.value), type: type.STRING };
                } else {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar substring ' + first_data.value + ' & ' + second_data.value + ' & ' + third_data.value));
                }
                break;
        }
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") String ternario (" + string_ternary_type[this.type] + ")\"];";
        const this_count = count

        const child_list = [this.first, this.second, this.third]
        for (const instr of child_list) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                result += instr.plot(Number(count + "1"))
                count++
            } catch (error) {
                console.log(error);
            }
        }
        return result
    }
}