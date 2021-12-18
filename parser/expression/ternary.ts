import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _3dCode } from "../system/console";

export class ternary extends expression {
    public translate(environment: environment): type {
        const conditionType = this.first.translate(environment);
        const conditionTemp = _3dCode.actualTemp;
        const trueType = this.second.translate(environment);
        const trueTemp = _3dCode.actualTemp;
        const falseType = this.third.translate(environment);
        const falseTemp = _3dCode.actualTemp;
        _3dCode.actualTag++
        const trueTag = _3dCode.actualTag;
        _3dCode.actualTag++
        const falseTag = _3dCode.actualTag;
        _3dCode.actualTag++
        const exitTag = _3dCode.actualTag;

        if (conditionType == type.BOOLEAN) {
            _3dCode.actualTemp++;
            _3dCode.output += 'if(T' + conditionTemp + ' == 1) goto L' + trueTag + ';//Return true value\n';
            _3dCode.output += 'goto L' + falseTag + ';//Return false value\n';
            _3dCode.output += 'L' + trueTag + ':\n';
            _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + trueTemp + ';//Set true value\n';
            _3dCode.output += 'goto L' + exitTag + ';\n';
            _3dCode.output += 'L' + falseTag + ':\n';
            _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + falseTemp + ';//Set true value\n';
            _3dCode.output += 'goto L' + exitTag + ';\n';
            _3dCode.output += 'L' + exitTag + ':\n';
            return trueType;
        } else {

        }
        // Default
        return type.NULL
    }

    constructor(public first: expression, public second: expression, public third: expression, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const first_data = this.first.execute(environment);
        const second_data = this.second.execute(environment);
        const third_data = this.third.execute(environment);

        if (first_data.type == type.BOOLEAN) {
            return { value: (first_data.value) ? second_data.value : third_data.value, type: (first_data.value) ? second_data.type : third_data.type };
        } else {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar opreacion ternaria: ' + first_data.value + ' & ' + second_data.value + ' & ' + third_data.value));
        }
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Ternaria\"];";
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