"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._forof = void 0;
const environment_1 = require("../system/environment");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
const variable_id_1 = require("../literal/variable_id");
const _array_1 = require("../literal/_array");
const _break_1 = require("./_break");
const _continue_1 = require("./_continue");
class _forof extends instruction_1.instruction {
    constructor(id, operator, code, line, column) {
        super(line, column);
        this.id = id;
        this.operator = operator;
        this.code = code;
    }
    translate(environment) {
        let nuevo;
        if (this.operator instanceof _array_1._array) {
            let val = this.operator;
            nuevo = new variable_id_1.variable_id('temp_array_test', 0, 1, 1);
            console_1._3dCode.output += '//Array temp_array_test will be stored in stack, start position: ' + console_1._3dCode.relativePos + ' of this context\n';
            environment.save_variable(nuevo.id, { value: val, type: type_1.type.INTEGER }, console_1._3dCode.absolutePos, console_1._3dCode.relativePos, val.body.length);
            val.translateElements(environment, 0);
            let size = val.getTotalItems();
            val.size = size;
            this.operator = nuevo;
        }
        let operatorType;
        let operatorTemp;
        operatorType = this.operator.translate(environment);
        operatorTemp = console_1._3dCode.actualTemp;
        environment.save_variable(this.id, { value: null, type: operatorType }, console_1._3dCode.absolutePos, console_1._3dCode.relativePos, 1);
        console_1._3dCode.absolutePos++;
        console_1._3dCode.relativePos++;
        if (operatorType == type_1.type.STRING) {
            let relativePos = console_1._3dCode.relativePos;
            console_1._3dCode.actualTemp++;
            let caracter = console_1._3dCode.actualTemp;
            console_1._3dCode.actualTag++;
            let inicio = console_1._3dCode.actualTag;
            console_1._3dCode.actualTag++;
            let final = console_1._3dCode.actualTag;
            console_1._3dCode.actualTag++;
            let continueTag = console_1._3dCode.actualTag;
            console_1._3dCode.output += 'L' + inicio + ':\n';
            console_1._3dCode.output += 'T' + caracter + ' = HEAP[(int)T' + operatorTemp + '];//Get character\n';
            console_1._3dCode.output += 'if(T' + caracter + ' == 36) goto L' + final + ';\n';
            console_1._3dCode.actualTemp++;
            let inicioString = console_1._3dCode.actualTemp;
            console_1._3dCode.output += 'T' + inicioString + ' = HP;//Save new start\n';
            console_1._3dCode.output += 'HEAP[(int)HP] = T' + caracter + ';//Save character\n';
            console_1._3dCode.output += 'HP = HP + 1;\n';
            console_1._3dCode.output += 'HEAP[(int)HP] = 36;//Save end of string\n';
            console_1._3dCode.output += 'HP = HP + 1;\n';
            relativePos = environment.get_relative_recursive(this.id, environment);
            console_1._3dCode.actualTemp++;
            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + ' + relativePos + ';\n';
            console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + inicioString + ';//Update value for variable ' + this.id + '\n';
            let tempContinue = console_1._3dCode.continueTag;
            console_1._3dCode.continueTag = continueTag;
            let tempBreak = console_1._3dCode.breakTag;
            console_1._3dCode.breakTag = final;
            for (const instruction of this.code) {
                instruction.translate(environment);
            }
            console_1._3dCode.breakTag = tempBreak;
            console_1._3dCode.continueTag = tempContinue;
            console_1._3dCode.output += 'L' + continueTag + ':\n';
            console_1._3dCode.output += 'T' + operatorTemp + ' = T' + operatorTemp + ' + 1;//Update position\n';
            console_1._3dCode.output += "goto L" + inicio + ";\n";
            console_1._3dCode.output += "L" + final + ":\n";
        }
        else {
            let size;
            let arreglo = this.operator;
            let return_data = environment.get_variable_recursive(arreglo.id, environment);
            let relativeArray = environment.get_relative_recursive(arreglo.id, environment);
            let relativePos = environment.get_relative_recursive(this.id, environment);
            if (return_data.value instanceof _array_1._array) {
                size = return_data.value.size;
            }
            console_1._3dCode.actualTemp++;
            let contador = console_1._3dCode.actualTemp;
            console_1._3dCode.actualTag++;
            let inicio = console_1._3dCode.actualTag;
            console_1._3dCode.actualTag++;
            let final = console_1._3dCode.actualTag;
            console_1._3dCode.actualTag++;
            let continueTag = console_1._3dCode.actualTag;
            console_1._3dCode.actualTemp++;
            let relativePosTemp = console_1._3dCode.actualTemp;
            console_1._3dCode.output += 'T' + relativePosTemp + ' = SP + ' + relativePos + ';//Get variable position\n';
            console_1._3dCode.actualTemp++;
            let iterador = console_1._3dCode.actualTemp;
            console_1._3dCode.output += 'T' + iterador + ' = SP + ' + relativeArray + ';//Set array start position\n';
            console_1._3dCode.output += 'T' + contador + ' = 0;//Set contador = 0\n';
            console_1._3dCode.actualTemp++;
            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + iterador + '];//Get first value in array\n';
            console_1._3dCode.output += 'STACK[(int)T' + relativePosTemp + '] = T' + console_1._3dCode.actualTemp + ';//Save first value in variable\n';
            console_1._3dCode.output += 'L' + inicio + ':\n';
            console_1._3dCode.output += 'if(T' + contador + ' == ' + size + ') goto L' + final + ';\n';
            let tempContinue = console_1._3dCode.continueTag;
            console_1._3dCode.continueTag = continueTag;
            let tempBreak = console_1._3dCode.breakTag;
            console_1._3dCode.breakTag = final;
            for (const instruction of this.code) {
                instruction.translate(environment);
            }
            console_1._3dCode.breakTag = tempBreak;
            console_1._3dCode.continueTag = tempContinue;
            console_1._3dCode.output += 'L' + continueTag + ':\n';
            console_1._3dCode.actualTemp++;
            console_1._3dCode.output += 'T' + contador + ' = T' + contador + ' + 1;//Update position\n';
            console_1._3dCode.output += 'T' + iterador + ' = T' + iterador + ' + 1;//Update position\n';
            console_1._3dCode.actualTemp++;
            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + iterador + '];//Get next value in array\n';
            console_1._3dCode.output += 'STACK[(int)T' + relativePosTemp + '] = T' + console_1._3dCode.actualTemp + ';//Save next value in variable\n';
            console_1._3dCode.output += "goto L" + inicio + ";\n";
            console_1._3dCode.output += "L" + final + ":\n";
        }
        if (this.operator instanceof _array_1._array) {
            environment.remove_temp_recursive(environment);
        }
        return type_1.type.NULL;
    }
    execute(current_environment) {
        // Initialize Variable
        const new_environment = new environment_1.environment(current_environment);
        new_environment.save_variable(this.id, { value: null, type: type_1.type.NULL }, 0, 0, 0);
        // Foreach value assign to variable
        if (this.operator instanceof _array_1._array) {
            // Execute the code foreach value
            for (const key of this.operator.body) {
                let key_data = key.execute(new_environment);
                new_environment.save_variable(this.id, key_data, 0, 0, 0);
                for (const instruction of this.code) {
                    let instruction_data = instruction.execute(new_environment);
                    if (new_environment.stop_flag) {
                        return instruction_data;
                    }
                    else if (instruction instanceof _break_1._break) {
                        break;
                    }
                    else if (instruction instanceof _continue_1._continue) {
                        continue;
                    }
                }
            }
        }
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") ForOf\"];";
        const this_count = count;
        const child_list = [this.operator];
        for (const instr of child_list) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                result += instr.plot(Number(count + "1"));
                count++;
            }
            catch (error) {
                console.log(error);
            }
        }
        for (const instr of this.code) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                result += instr.plot(Number(count + "1"));
                count++;
            }
            catch (error) {
                console.log(error);
            }
        }
        return result;
    }
}
exports._forof = _forof;
//# sourceMappingURL=_forof.js.map