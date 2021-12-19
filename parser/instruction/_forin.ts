import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console, _3dCode } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";
import { _return } from "./_return";
import { array_range } from "../expression/array_range";
import { array_access } from "./array_access";
import { native } from "../literal/native";
import { variable_id } from "../literal/variable_id";
import { _array } from "../literal/_array";

export class _forin extends instruction {

    public translate(environment: environment): type {
        if (this.operator instanceof array_access) {

        } else {
            let operatorType;
            let operatorTemp;
            operatorType = this.operator.translate(environment);
            operatorTemp = _3dCode.actualTemp;
            environment.save_variable(this.id, { value: null, type: operatorType }, _3dCode.absolutePos, _3dCode.relativePos, 1);
            _3dCode.absolutePos++;
            _3dCode.relativePos++;
            if (operatorType == type.STRING) {
                let relativePos = _3dCode.relativePos;
                _3dCode.actualTemp++;
                let caracter = _3dCode.actualTemp;
                _3dCode.actualTag++;
                let inicio = _3dCode.actualTag;
                _3dCode.actualTag++;
                let final = _3dCode.actualTag;
                _3dCode.actualTag++;
                let continueTag = _3dCode.actualTag;
                _3dCode.output += 'L' + inicio + ':\n';
                _3dCode.output += 'T' + caracter + ' = HEAP[(int)T' + operatorTemp + '];//Get character\n';
                _3dCode.output += 'if(T' + caracter + ' == 36) goto L' + final + ';\n';
                _3dCode.actualTemp++;
                let inicioString = _3dCode.actualTemp;
                _3dCode.output += 'T' + inicioString + ' = HP;//Save new start\n';
                _3dCode.output += 'HEAP[(int)HP] = T' + caracter + ';//Save character\n';
                _3dCode.output += 'HP = HP + 1;\n';
                _3dCode.output += 'HEAP[(int)HP] = 36;//Save end of string\n';
                _3dCode.output += 'HP = HP + 1;\n';
                relativePos = environment.get_relative(this.id);
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + ' + relativePos + ';\n';
                _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + inicioString + ';//Update value for variable ' + this.id + '\n';
                let tempContinue = _3dCode.continueTag;
                _3dCode.continueTag = continueTag;
                let tempBreak = _3dCode.breakTag;
                _3dCode.breakTag = final;
                for (const instruction of this.code) {
                    instruction.translate(environment)
                }
                _3dCode.breakTag = tempBreak;
                _3dCode.continueTag = tempContinue;
                _3dCode.output += 'L' + continueTag + ':\n';
                _3dCode.output += 'T' + operatorTemp + ' = T' + operatorTemp + ' + 1;//Update position\n';
                _3dCode.output += "goto L" + inicio + ";\n";
                _3dCode.output += "L" + final + ":\n";
            } else {
                let size;
                let return_data = environment.get_variable(this.id);
                if (return_data.value instanceof _array) {
                    size = return_data.value.getTotalItems();
                }
                console.log(return_data)
                let relative = environment.get_relative(this.id);
                let relativePos = _3dCode.relativePos;
                _3dCode.actualTemp++;
                let contador = _3dCode.actualTemp;
                _3dCode.actualTag++;
                let inicio = _3dCode.actualTag;
                _3dCode.actualTag++;
                let final = _3dCode.actualTag;
                _3dCode.actualTag++;
                let continueTag = _3dCode.actualTag;
                _3dCode.output += 'L' + inicio + ':\n';
                _3dCode.output += 'if(T' + contador + ' == ' + size + ') goto L' + final + ';\n';
                _3dCode.actualTemp++;
                let iterador = _3dCode.actualTemp;
                _3dCode.output += 'T' + iterador + ' = SP + ' + relative + ';//Set array start\n';
                _3dCode.output += 'T' + iterador + ' = T' + iterador + ' + T' + contador + ';//Set position\n';
                relativePos = environment.get_relative(this.id);
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[(int)T' + iterador + '];\n';
                _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + _3dCode.actualTemp + ';//Update value for index\n';
                let tempContinue = _3dCode.continueTag;
                _3dCode.continueTag = continueTag;
                let tempBreak = _3dCode.breakTag;
                _3dCode.breakTag = final;
                for (const instruction of this.code) {
                    instruction.translate(environment)
                }
                _3dCode.breakTag = tempBreak;
                _3dCode.continueTag = tempContinue;
                _3dCode.output += 'L' + continueTag + ':\n';
                _3dCode.output += 'T' + contador + ' = T' + contador + ' + 1;//Update position\n';
                _3dCode.output += "goto L" + inicio + ";\n";
                _3dCode.output += "L" + final + ":\n";
            }
        }
        return type.NULL;
    }

    constructor(public id: string, public operator: array_access | expression | native | variable_id, public code: Array<instruction>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        throw new Error("Method not implemented.");
    }
    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}