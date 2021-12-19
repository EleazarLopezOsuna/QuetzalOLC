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

export class _forin extends instruction {

    public translate(environment: environment): type {
        if (this.operator instanceof array_access) {

        } else if (this.operator instanceof native || this.operator instanceof expression) {
            let operatorType = this.operator.translate(environment);
            let relativePos = _3dCode.relativePos;
            _3dCode.relativePos = 0;
            environment.save_variable(this.id, { value: null, type: operatorType }, _3dCode.absolutePos, _3dCode.relativePos, 1);
            let operatorTemp = _3dCode.actualTemp;
            _3dCode.actualTemp++;
            let caracter = _3dCode.actualTemp;
            if (operatorType == type.STRING) {
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
                let relativePos = environment.get_relative(this.id);
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
            }
            _3dCode.relativePos = relativePos;
        }
        return type.NULL;
    }

    constructor(public id: string, public operator: array_access | expression | native | string, public code: Array<instruction>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        throw new Error("Method not implemented.");
    }
    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}