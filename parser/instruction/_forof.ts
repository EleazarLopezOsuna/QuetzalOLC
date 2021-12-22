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
import { _break } from "./_break";
import { _continue } from "./_continue";

export class _forof extends instruction {

    public translate(environment: environment): type {
        let nuevo;
        if (this.operator instanceof _array) {
            let val = this.operator as _array
            nuevo = new variable_id('temp_array_test', 0, 1, 1);
            _3dCode.output += '//Array temp_array_test will be stored in stack, start position: ' + _3dCode.relativePos + ' of this context\n';
            environment.save_variable(nuevo.id, { value: val, type: type.INTEGER }, _3dCode.absolutePos, _3dCode.relativePos, val.body.length)
            val.translateElements(environment, 0)
            let size = val.getTotalItems();
            val.size = size;
            this.operator = nuevo;
        }
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
            relativePos = environment.get_relative_recursive(this.id, environment);
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
            let arreglo = this.operator as variable_id
            let return_data = environment.get_variable_recursive(arreglo.id, environment);
            let relativeArray = environment.get_relative_recursive(arreglo.id, environment);
            let relativePos = environment.get_relative_recursive(this.id, environment);
            if (return_data.value instanceof _array) {
                size = return_data.value.size;
            }
            _3dCode.actualTemp++;
            let contador = _3dCode.actualTemp;
            _3dCode.actualTag++;
            let inicio = _3dCode.actualTag;
            _3dCode.actualTag++;
            let final = _3dCode.actualTag;
            _3dCode.actualTag++;
            let continueTag = _3dCode.actualTag;
            _3dCode.actualTemp++;
            let relativePosTemp = _3dCode.actualTemp;

            _3dCode.output += 'T' + relativePosTemp + ' = SP + ' + relativePos + ';//Get variable position\n';
            _3dCode.actualTemp++;
            let iterador = _3dCode.actualTemp;
            _3dCode.output += 'T' + iterador + ' = SP + ' + relativeArray + ';//Set array start position\n';
            _3dCode.output += 'T' + contador + ' = 0;//Set contador = 0\n';
            _3dCode.actualTemp++;
            _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[(int)T' + iterador + '];//Get first value in array\n';
            _3dCode.output += 'STACK[(int)T' + relativePosTemp + '] = T' + _3dCode.actualTemp + ';//Save first value in variable\n';
            _3dCode.output += 'L' + inicio + ':\n';
            _3dCode.output += 'if(T' + contador + ' == ' + size + ') goto L' + final + ';\n';
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
            _3dCode.actualTemp++;
            _3dCode.output += 'T' + contador + ' = T' + contador + ' + 1;//Update position\n';
            _3dCode.output += 'T' + iterador + ' = T' + iterador + ' + 1;//Update position\n';


            _3dCode.actualTemp++;
            _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[(int)T' + iterador + '];//Get next value in array\n';
            _3dCode.output += 'STACK[(int)T' + relativePosTemp + '] = T' + _3dCode.actualTemp + ';//Save next value in variable\n';

            _3dCode.output += "goto L" + inicio + ";\n";
            _3dCode.output += "L" + final + ":\n";
        }
        if (this.operator instanceof _array) {
            environment.remove_temp_recursive(environment);
        }
        return type.NULL;
    }

    constructor(public id: string, public operator: _array | expression | native | variable_id, public code: Array<instruction>, line: number, column: number) {
        super(line, column);
    }

    public execute(current_environment: environment): data {
        // Initialize Variable
        const new_environment = new environment(current_environment);
        new_environment.save_variable(this.id, { value: null, type: type.NULL }, 0, 0, 0)

        let arr_to_iterate:_array = (this.operator instanceof _array) ? this.operator : this.operator.execute(new_environment).value
        // Foreach value assign to variable
        // Execute the code foreach value
        for (const key of arr_to_iterate.body) {
            let key_data = key.execute(new_environment)
            new_environment.save_variable(this.id, key_data, 0, 0, 0)
            for (const instruction of this.code) {
                let instruction_data = instruction.execute(new_environment)
                if (new_environment.stop_flag) {
                    return instruction_data
                } else if (instruction instanceof _break) {
                    break
                } else if (instruction instanceof _continue) {
                    continue
                }
            }
        }
        return { value: null, type: type.NULL }
    }
    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") ForOf\"];";
        const this_count = count

        const child_list = [this.operator]
        for (const instr of child_list) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                result += instr.plot(Number(count + "1"))
                count++
            } catch (error) {
                console.log(error);
            }
        }

        for (const instr of this.code) {
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