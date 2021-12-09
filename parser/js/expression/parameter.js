"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parameter = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
class parameter extends expression_1.expression {
    constructor(native_type, id, line, column) {
        super(line, column);
        this.native_type = native_type;
        this.id = id;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        let return_type = type_1.type.NULL;
        switch (this.native_type) {
            case "int":
                return_type = type_1.type.INTEGER;
                break;
            case "String":
                return_type = type_1.type.STRING;
                break;
            case "double":
                return_type = type_1.type.FLOAT;
                break;
            case "boolean":
                return_type = type_1.type.BOOLEAN;
                break;
            case "char":
                return_type = type_1.type.CHAR;
                break;
            default:
                // TODO buscar en los structs
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Tipo no valido'));
                break;
        }
        return { value: this.id, type: return_type };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.parameter = parameter;
//# sourceMappingURL=parameter.js.map