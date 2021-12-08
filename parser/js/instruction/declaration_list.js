"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declaration_list = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
class declaration_list extends expression_1.expression {
    constructor(native_type, declare_list, line, column) {
        super(line, column);
        this.native_type = native_type;
        this.declare_list = declare_list;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    add_to_list(item) {
        this.declare_list.push(item);
    }
    execute(environment) {
        this.declare_list.forEach(item => {
            let item_data = item.execute(environment);
            // match the type in the system and the string type
            let validation_arr = [
                [type_1.type.BOOLEAN, "boolean"],
                [type_1.type.CHAR, "char"],
                [type_1.type.FLOAT, "double"],
                [type_1.type.INTEGER, "int"],
                [type_1.type.STRING, "String"],
            ];
            // if is undefined save the variable with the type declared
            if (item_data.type == type_1.type.NULL) {
                validation_arr.forEach(validate_item => {
                    if (validate_item[1] == this.native_type) {
                        // Save the variable 
                        item_data.type = validate_item[0];
                        if (environment.get_variable(item.variable_id).type != type_1.type.NULL) {
                            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable ya inicializada: ' + item.variable_id));
                        }
                        else {
                            environment.save_variable(item.variable_id, item_data);
                        }
                        return;
                    }
                });
            }
            // if the save variable has an expression check types
            else {
                // Checking both types
                let checked = false;
                validation_arr.forEach(validate_item => {
                    if (validate_item[0] == item_data.type && validate_item[1] == this.native_type) {
                        checked = true;
                    }
                });
                // if checked type save the variable
                if (!checked) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede iniciar con distinto tipo de dato para: ' + item.variable_id));
                }
                else {
                    // Save the variable 
                    if (environment.get_variable(item.variable_id).type != type_1.type.NULL) {
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable ya inicializada: ' + item.variable_id));
                    }
                    else {
                        environment.save_variable(item.variable_id, item_data);
                    }
                }
            }
        });
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.declaration_list = declaration_list;
//# sourceMappingURL=declaration_list.js.map