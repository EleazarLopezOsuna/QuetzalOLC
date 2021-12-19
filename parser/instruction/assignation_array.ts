import { relative } from "path/posix";
import { env } from "process";
import { expression } from "../abstract/expression";
import { instruction } from "../abstract/instruction";
import { literal } from "../abstract/literal";
import { _array } from "../literal/_array";
import { _3dCode } from "../system/console";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";

export class assignation_array extends instruction {
    public translate(environment: environment): type {
        let return_data = environment.get_variable_recursive(this.id, environment)
        this.expr.translate(environment)
        let exprTemp = _3dCode.actualTemp;
        let tempList = []
        if (return_data.type != type.UNDEFINED) {
            if (return_data.value instanceof _array) {
                for (let dimension of this.dimensions) {
                    dimension.translate(environment)
                    tempList.push(_3dCode.actualTemp)
                }
                _3dCode.actualTemp++;
                let uno = _3dCode.actualTemp;
                _3dCode.actualTemp++;
                let dos = _3dCode.actualTemp;
                for (let i = 0; i < tempList.length; i++) {
                    if (i == 0)
                        _3dCode.output += 'T' + uno + ' = T' + tempList[i] + ';\n';
                    else {
                        _3dCode.output += 'T' + dos + ' = T' + uno + ' * ' + return_data.value.dimensionSize.get(i) + ';\n';
                        _3dCode.output += 'T' + uno + ' = T' + dos + ' + T' + tempList[i] + ';\n';
                    }
                }
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + ' + environment.get_relative_recursive(this.id, environment) + ';//Set array initial position\n';
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + _3dCode.actualTemp + ' + T' + uno + ';//Add index\n';
                _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + ']' + ' = T' + exprTemp + ';//Get value\n';
            } else {

            }
        } else {

        }
        return type.NULL
    }

    constructor(public id: string, public dimensions: Array<expression | literal>, public expr: expression | literal, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const expr_data = this.expr.execute(environment);
        // validate that exists
        let saved_variable = environment.get_variable(this.id)
        if (saved_variable.type != type.UNDEFINED) {
            // 
            if (saved_variable.value instanceof _array) {
                if (this.dimensions.length == 0) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Numero de dimensiones no validas para el array'));
                }
                // validate that the array have the correct dimensions
                if (!saved_variable.value.check_dimensions_number(this.dimensions)) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Numero de dimensiones no validas para el array'));
                    return { value: null, type: type.NULL }
                }

                // and each have the correct length
                if (!saved_variable.value.check_dimensions_length(this.dimensions, environment)) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Index no valido'));
                    return { value: null, type: type.NULL }
                }

                // validate the type
                if (saved_variable.type == expr_data.type) {
                    // change the data in the array
                    if (!saved_variable.value.assign_value(this.dimensions, environment, this.expr)) {
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Error al asignar valor al array'));
                    }
                } else {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Tipo diferente, no se puede asignar'));
                }
            }
        } else {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable no inicializada'));
        }
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Assignacion de Array\"];";
        const this_count = count
        const child_list = [this.expr]
        for (const instr of child_list) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                result += instr.plot(Number(count + "1"))
                count++
            } catch (error) {
                console.log(error);
            }
        }
        for (const instr of this.dimensions) {
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