import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _3dCode, _console } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";
import { _array } from "../literal/_array";
import { _struct } from "../literal/_struct";
import { struct_item } from "../literal/struct_item";
import { native } from "../literal/native";

export class declaration_struct_item extends instruction {

    public translate(environment: environment): type {
        // check the struct types
        if (this.struct_id_array[0] != this.struct_id_array[1]) {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede inicializar con diferente tipo de struct'));
            return type.NULL
        }

        // obtain struct definition
        let struct_definition = environment.get_variable_recursive(this.struct_id_array[0], environment)
        if (struct_definition.type != type.STRUCT) {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Struct no definido'));
            return type.NULL
        }

        // verify that have the correct number and correct type of parameter
        if (struct_definition.value instanceof _struct) {

            // and each have the correct types
            /*if (!struct_definition.value.check_types(this.parameters, environment)) {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Parametro de tipo no valido'));
                return type.NULL
            }*/

            // Save the variable 
            if (environment.get_variable(this.variable_id).type != type.UNDEFINED) {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
                return type.NULL
            } else {
                if (this.parameters.length == 1) {
                    let element = this.parameters[0]
                    if (element instanceof native) {
                        if (element.type == type.NULL) {
                            environment.save_variable(this.variable_id, { value: null, type: type.STRUCT }, _3dCode.absolutePos, _3dCode.relativePos, 1);
                            let newVariableRelative = _3dCode.relativePos;
                            _3dCode.absolutePos++;
                            _3dCode.relativePos++;
                            let elementData;
                            let contador = 1;
                            _3dCode.environmentList.forEach(envi => {
                                //Get struct environment
                                if (envi.name == this.struct_id_array[0]) {
                                    envi.symbol_map.forEach(element => {
                                        elementData = element.data as data
                                        switch (elementData.type) {
                                            case type.STRING:
                                            case type.CHAR:
                                                _3dCode.actualTemp++;
                                                _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + ' + newVariableRelative + ';\n';
                                                _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + _3dCode.actualTemp + ' + ' + contador + ';\n';
                                                _3dCode.output += 'HEAP[(int)HP] = 36;\n';
                                                _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = HP;\n';
                                                _3dCode.output += 'HP = HP + 1;\n';
                                                break;
                                            case type.BOOLEAN:
                                            case type.INTEGER:
                                            case type.FLOAT:
                                                _3dCode.actualTemp++;
                                                _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + ' + newVariableRelative + ';\n';
                                                _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + _3dCode.actualTemp + ' + ' + contador + ';\n';
                                                _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = 0;\n';
                                                break;
                                        }
                                        _3dCode.absolutePos++;
                                        _3dCode.relativePos++;
                                        contador++;
                                    })
                                }
                            })
                        }
                    }
                } else {
                    // validate that the array have the correct number of parameters
                    if (!struct_definition.value.check_length(this.parameters)) {
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Numero de parametros no validas para el array'));
                        return type.NULL
                    }
                    environment.save_variable(this.variable_id, { value: null, type: type.STRUCT }, _3dCode.absolutePos, _3dCode.relativePos, 1);
                    let newVariableRelative = _3dCode.relativePos;
                    _3dCode.absolutePos++;
                    _3dCode.relativePos++;
                    let parameterTemp;
                    let contador = 1;
                    _3dCode.environmentList.forEach(envi => {
                        //Get struct environment
                        if (envi.name == this.struct_id_array[0]) {
                            envi.symbol_map.forEach(element => {
                                this.parameters[contador - 1].translate(environment);
                                parameterTemp = _3dCode.actualTemp;
                                _3dCode.actualTemp++;
                                _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + ' + newVariableRelative + ';\n';
                                _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + _3dCode.actualTemp + ' + ' + contador + ';\n';
                                _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + parameterTemp + ';\n';
                                _3dCode.absolutePos++;
                                _3dCode.relativePos++;
                                contador++;
                            })
                        }
                    })
                }
            }

        }

        return type.NULL
    }

    constructor(public struct_id_array: Array<string>, public variable_id: string, public parameters: Array<expression | literal>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        // check the struct types
        if (this.struct_id_array[0] != this.struct_id_array[1]) {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede inicializar con diferente tipo de struct'));
            return { value: null, type: type.NULL }
        }

        // obtain struct definition
        let struct_definition = environment.get_variable(this.struct_id_array[0])
        if (struct_definition.type != type.STRUCT) {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Struct no definido'));
            return { value: null, type: type.NULL }
        }

        // verify that have the correct number and correct type of parameter
        if (struct_definition.value instanceof _struct) {

            // validate that the array have the correct number of parameters
            if (!struct_definition.value.check_length(this.parameters)) {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Numero de parametros no validas para el array'));
                return { value: null, type: type.NULL }
            }

            // and each have the correct types
            if (!struct_definition.value.check_types(this.parameters, environment)) {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Parametro de tipo no valido'));
                return { value: null, type: type.NULL }
            }

            // Save the variable 
            if (environment.get_variable(this.variable_id).type != type.UNDEFINED) {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
                return { value: null, type: type.NULL }
            } else {
                environment.save_variable(this.variable_id, { value: new struct_item(this.parameters, this.struct_id_array[0], this.line, this.column), type: type.STRUCT_ITEM }, 0, 0, 0)
            }

        }

        // create a new variable with this type of struct

        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Lista de Declaraciones (" + this.variable_id + ")\"];";
        const this_count = count
        for (const str of this.struct_id_array) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                result += "node" + Number(count + "1") + "[label=\"(" + this.line + "," + this.column + ") Declaracion (" + str + ")\"];";
                count++
            } catch (error) {
                console.log(error);
            }
        }
        const arr_list = [this.parameters]
        for (const instr_arr of arr_list) {
            for (const instr of instr_arr) {
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