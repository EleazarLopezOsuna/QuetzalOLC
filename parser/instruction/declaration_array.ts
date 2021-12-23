import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console, _3dCode } from "../system/console";
import { instruction } from "../abstract/instruction";
import { _array } from "../literal/_array";
import { literal } from "../abstract/literal";
import { variable_id } from "../literal/variable_id";
import { expression } from "../abstract/expression";
import { array_range } from "../expression/array_range";

export class declaration_array extends instruction {

    public translate(environment: environment): type {
        if (this.value == null) {
            if (environment.get_variable_recursive(this.variable_id, environment).type != type.UNDEFINED) {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
            } else {
                _3dCode.actualTemp++;
                _3dCode.output += '//Array ' + this.variable_id + ' will be stored in stack, start position: ' + _3dCode.relativePos + ' of this context\n';
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + ' + _3dCode.relativePos + ';\n';
                _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = 0;\n';
                //Size is 0 because its just declaration without assignation of values
                environment.save_variable(this.variable_id, { value: this.value, type: this.type }, _3dCode.absolutePos, _3dCode.relativePos, 0);
                _3dCode.absolutePos++;
                _3dCode.relativePos++;
            }
        } else if (this.value instanceof _array) {
            let val = this.value as _array
            _3dCode.output += '//Array ' + this.variable_id + ' will be stored in stack, start position: ' + _3dCode.relativePos + ' of this context\n';
            environment.save_variable(this.variable_id, { value: this.value, type: this.type }, _3dCode.absolutePos, _3dCode.relativePos, this.value.body.length)
            this.value.translateElements(environment, 0)
            let size = val.getTotalItems();
            this.value.size = size;
        } else if (this.value instanceof variable_id) {

        }
        // Default
        return type.NULL
    }

    constructor(public type: type, public variable_id: string, public value: _array | null | literal, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {

        // if is undefined save the variable with the type declared
        if (this.value == null) {
            // Save the variable 
            if (environment.get_variable(this.variable_id).type != type.UNDEFINED) {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
            } else {
                environment.save_variable(this.variable_id, { value: this.value, type: this.type }, 0, 0, 0)
            }
        }
        // if the save variable has an expression check types
        else if (this.value instanceof _array) {
            // Checking both types
            let checked = this.value.checkType(this.type, environment)

            // if checked type save the variable
            if (!checked) {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede iniciar con distinto tipo de dato para: ' + this.variable_id));
            } else {
                // Save the variable 
                if (environment.get_variable(this.variable_id).type != type.UNDEFINED) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
                } else {
                    environment.save_variable(this.variable_id, { value: this.value, type: this.type }, 0, 0, 0)
                }
            }
        }
        // copying one array to another
        else if (this.value instanceof variable_id) {
            let obtained_array_data = this.value.execute(environment)
            if (obtained_array_data.value instanceof _array) {
                let checked = obtained_array_data.value.checkType(this.type, environment)
                // if checked type copy the array
                if (!checked) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede iniciar con distinto tipo de dato para: ' + this.variable_id));
                } else {
                    // Save the variable 
                    if (environment.get_variable(this.variable_id).type != type.UNDEFINED) {
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
                    } else {
                        // copy the entire object
                        const new_array = obtained_array_data.value
                        environment.save_variable(this.variable_id, { value: new_array, type: this.type }, 0, 0, 0)
                    }
                }
            } else {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede copiar si no es un array'));
            }
        }
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Declaracion de Array (" + this.variable_id + "," + type[this.type] + ")\"];";
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