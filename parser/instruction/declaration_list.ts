import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console } from "../system/console";
import { declaration_item } from "./declaration_item";

export class declaration_list extends expression {

    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public native_type: string, public declare_list: [declaration_item], line: number, column: number) {
        super(line, column);
    }

    public add_to_list(item: declaration_item) {
        this.declare_list.push(item)
    }

    public execute(environment: environment): data {
        this.declare_list.forEach(item => {
            let item_data = item.execute(environment);

            // match the type in the system and the string type
            let validation_arr: Array<Array<type|string>> = [
                [type.BOOLEAN, "boolean"],
                [type.CHAR, "char"],
                [type.FLOAT, "double"],
                [type.INTEGER, "int"],
                [type.STRING, "String"],
            ]

            // if is undefined save the variable with the type declared
            if (item_data.type == type.NULL) {
                validation_arr.forEach(validate_item => {
                    if (validate_item[1] == this.native_type) {
                        // Save the variable 
                        item_data.type = validate_item[0] as type; 
                        environment.save_variable(item.variable_id, item_data)
                        return
                    }
                });
            }
            // if the save variable has an expression check types
            else {
                // Checking both types
                let checked = false
                validation_arr.forEach(validate_item => {
                    if (validate_item[0] == item_data.type && validate_item[1] == this.native_type) {
                        checked = true
                    }
                });

                // if checked type save the variable
                if (!checked) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede iniciar con distinto tipo de dato para: ' + item_data.value));
                } else {
                    // Save the variable 
                    environment.save_variable(item.variable_id, item_data)
                }
            }

        });
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}