"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declaration_struct_item = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
const _struct_1 = require("../literal/_struct");
const struct_item_1 = require("../literal/struct_item");
const native_1 = require("../literal/native");
class declaration_struct_item extends instruction_1.instruction {
    constructor(struct_id_array, variable_id, parameters, line, column) {
        super(line, column);
        this.struct_id_array = struct_id_array;
        this.variable_id = variable_id;
        this.parameters = parameters;
    }
    translate(environment) {
        // check the struct types
        if (this.struct_id_array[0] != this.struct_id_array[1]) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede inicializar con diferente tipo de struct'));
            return type_1.type.NULL;
        }
        // obtain struct definition
        let struct_definition = environment.get_variable_recursive(this.struct_id_array[0], environment);
        if (struct_definition.type != type_1.type.STRUCT) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Struct no definido'));
            return type_1.type.NULL;
        }
        // verify that have the correct number and correct type of parameter
        if (struct_definition.value instanceof _struct_1._struct) {
            // and each have the correct types
            /*if (!struct_definition.value.check_types(this.parameters, environment)) {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Parametro de tipo no valido'));
                return type.NULL
            }*/
            // Save the variable 
            if (environment.get_variable(this.variable_id).type != type_1.type.UNDEFINED) {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
                return type_1.type.NULL;
            }
            else {
                if (this.parameters.length == 1) {
                    let element = this.parameters[0];
                    if (element instanceof native_1.native) {
                        if (element.type == type_1.type.NULL) {
                            environment.save_variable(this.variable_id, { value: null, type: type_1.type.STRUCT }, console_1._3dCode.absolutePos, console_1._3dCode.relativePos, 1);
                            let newVariableRelative = console_1._3dCode.relativePos;
                            console_1._3dCode.absolutePos++;
                            console_1._3dCode.relativePos++;
                            let elementData;
                            let contador = 1;
                            console_1._3dCode.environmentList.forEach(envi => {
                                //Get struct environment
                                if (envi.name == this.struct_id_array[0]) {
                                    envi.symbol_map.forEach(element => {
                                        elementData = element.data;
                                        switch (elementData.type) {
                                            case type_1.type.STRING:
                                            case type_1.type.CHAR:
                                                console_1._3dCode.actualTemp++;
                                                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + ' + newVariableRelative + ';\n';
                                                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + console_1._3dCode.actualTemp + ' + ' + contador + ';\n';
                                                console_1._3dCode.output += 'HEAP[(int)HP] = 36;\n';
                                                console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = HP;\n';
                                                console_1._3dCode.output += 'HP = HP + 1;\n';
                                                break;
                                            case type_1.type.BOOLEAN:
                                            case type_1.type.INTEGER:
                                            case type_1.type.FLOAT:
                                                console_1._3dCode.actualTemp++;
                                                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + ' + newVariableRelative + ';\n';
                                                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + console_1._3dCode.actualTemp + ' + ' + contador + ';\n';
                                                console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = 0;\n';
                                                break;
                                        }
                                        console_1._3dCode.absolutePos++;
                                        console_1._3dCode.relativePos++;
                                        contador++;
                                    });
                                }
                            });
                        }
                    }
                }
                else {
                    // validate that the array have the correct number of parameters
                    if (!struct_definition.value.check_length(this.parameters)) {
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Numero de parametros no validas para el array'));
                        return type_1.type.NULL;
                    }
                    environment.save_variable(this.variable_id, { value: null, type: type_1.type.STRUCT }, console_1._3dCode.absolutePos, console_1._3dCode.relativePos, 1);
                    let newVariableRelative = console_1._3dCode.relativePos;
                    console_1._3dCode.absolutePos++;
                    console_1._3dCode.relativePos++;
                    let parameterTemp;
                    let contador = 1;
                    console_1._3dCode.environmentList.forEach(envi => {
                        //Get struct environment
                        if (envi.name == this.struct_id_array[0]) {
                            envi.symbol_map.forEach(element => {
                                this.parameters[contador - 1].translate(environment);
                                parameterTemp = console_1._3dCode.actualTemp;
                                console_1._3dCode.actualTemp++;
                                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + ' + newVariableRelative + ';\n';
                                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + console_1._3dCode.actualTemp + ' + ' + contador + ';\n';
                                console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + parameterTemp + ';\n';
                                console_1._3dCode.absolutePos++;
                                console_1._3dCode.relativePos++;
                                contador++;
                            });
                        }
                    });
                }
            }
        }
        return type_1.type.NULL;
    }
    execute(environment) {
        // check the struct types
        if (this.struct_id_array[0] != this.struct_id_array[1]) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede inicializar con diferente tipo de struct'));
            return { value: null, type: type_1.type.NULL };
        }
        // obtain struct definition
        let struct_definition = environment.get_variable(this.struct_id_array[0]);
        if (struct_definition.type != type_1.type.STRUCT) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Struct no definido'));
            return { value: null, type: type_1.type.NULL };
        }
        // verify that have the correct number and correct type of parameter
        if (struct_definition.value instanceof _struct_1._struct) {
            // validate that the array have the correct number of parameters
            if (!struct_definition.value.check_length(this.parameters)) {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Numero de parametros no validas para el array'));
                return { value: null, type: type_1.type.NULL };
            }
            // and each have the correct types
            if (!struct_definition.value.check_types(this.parameters, environment)) {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Parametro de tipo no valido'));
                return { value: null, type: type_1.type.NULL };
            }
            // Save the variable 
            if (environment.get_variable(this.variable_id).type != type_1.type.UNDEFINED) {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
                return { value: null, type: type_1.type.NULL };
            }
            else {
                environment.save_variable(this.variable_id, { value: new struct_item_1.struct_item(this.parameters, this.struct_id_array[0], this.line, this.column), type: type_1.type.STRUCT_ITEM }, 0, 0, 0);
            }
        }
        // create a new variable with this type of struct
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Lista de Declaraciones (" + this.variable_id + ")\"];";
        const this_count = count;
        for (const str of this.struct_id_array) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                result += "node" + Number(count + "1") + "[label=\"(" + this.line + "," + this.column + ") Declaracion (" + str + ")\"];";
                count++;
            }
            catch (error) {
                console.log(error);
            }
        }
        const arr_list = [this.parameters];
        for (const instr_arr of arr_list) {
            for (const instr of instr_arr) {
                try {
                    result += "node" + this_count + " -> " + "node" + count + "1;";
                    result += instr.plot(Number(count + "1"));
                    count++;
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
        return result;
    }
}
exports.declaration_struct_item = declaration_struct_item;
//# sourceMappingURL=declaration_struct_item.js.map