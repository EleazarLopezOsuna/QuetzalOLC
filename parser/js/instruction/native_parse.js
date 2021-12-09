"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.native_parse = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
class native_parse extends expression_1.expression {
    constructor(native_type, value, line, column) {
        super(line, column);
        this.native_type = native_type;
        this.value = value;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        let value_data = this.value.execute(environment);
        switch (this.native_type) {
            case "int":
                try {
                    return { value: parseInt(value_data.value), type: type_1.type.INTEGER };
                }
                catch (e) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede parsear a int el valor ' + value_data.value));
                }
            case "double":
                try {
                    return { value: parseFloat(value_data.value), type: type_1.type.FLOAT };
                }
                catch (e) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede parsear a double el valor ' + value_data.value));
                }
            case "boolean":
                try {
                    return { value: Boolean(value_data.value), type: type_1.type.BOOLEAN };
                }
                catch (e) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede parsear a boolean el valor ' + value_data.value));
                }
        }
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.native_parse = native_parse;
//# sourceMappingURL=native_parse.js.map