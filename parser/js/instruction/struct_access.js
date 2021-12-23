"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.struct_access = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
const variable_id_1 = require("../literal/variable_id");
const struct_item_1 = require("../literal/struct_item");
class struct_access extends instruction_1.instruction {
    constructor(id, property, line, column) {
        super(line, column);
        this.id = id;
        this.property = property;
    }
    translate(environment) {
        if (this.id instanceof variable_id_1.variable_id) {
            const tipoStruct = environment.getStructType_recursive(this.id.id, environment);
            const relativePos = environment.get_relative_recursive(this.id.id, environment);
            let contador = 1;
            let returnData = { value: null, type: type_1.type.NULL };
            console_1._3dCode.environmentList.forEach(envi => {
                if (envi.name === tipoStruct) {
                    envi.symbol_map.forEach(element => {
                        if (element.id == this.property) {
                            console_1._3dCode.actualTemp++;
                            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + ' + relativePos + ';\n';
                            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + console_1._3dCode.actualTemp + ' + ' + contador + ';\n';
                            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + console_1._3dCode.actualTemp + '];\n';
                            returnData = element.data;
                            console.log(returnData);
                            return;
                        }
                        contador++;
                    });
                    return;
                }
            });
            return returnData.type;
        }
        else {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'La variable no es un struct'));
            return type_1.type.NULL;
        }
    }
    execute(environment) {
        const struct_data = this.id.execute(environment);
        if (struct_data.value instanceof struct_item_1.struct_item) {
            let returned_object = struct_data.value.get_value(this.property, environment);
            if (returned_object != null) {
                return returned_object.execute(environment);
            }
            else {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Propiedad no existente en el struct'));
                return { value: null, type: type_1.type.NULL };
            }
        }
        else {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'La variable no es un struct'));
            return { value: null, type: type_1.type.NULL };
        }
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Struct Property (" + this.property + ")\"];";
        const this_count = count;
        const child_list = [this.id];
        for (const instr of child_list) {
            if (instr != null) {
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
exports.struct_access = struct_access;
//# sourceMappingURL=struct_access.js.map