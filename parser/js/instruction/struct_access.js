"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.struct_access = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const instruction_1 = require("../abstract/instruction");
const struct_item_1 = require("../literal/struct_item");
class struct_access extends instruction_1.instruction {
    constructor(id, property, line, column) {
        super(line, column);
        this.id = id;
        this.property = property;
    }
    translate(environment) {
        return type_1.type.NULL;
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
        throw new Error("Method not implemented.");
    }
}
exports.struct_access = struct_access;
//# sourceMappingURL=struct_access.js.map