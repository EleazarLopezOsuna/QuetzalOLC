import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console } from "../system/console";
import { declaration_item } from "./declaration_item";
import { instruction } from "../abstract/instruction";

export class declaration_list extends instruction {

    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public native_type: type, public declare_list: [declaration_item], line: number, column: number) {
        super(line, column);
    }

    public add_to_list(item: declaration_item) {
        this.declare_list.push(item)
    }

    public execute(environment: environment): data {
        this.declare_list.forEach(item => {
            let item_data = item.execute(environment);

            // if is undefined save the variable with the type declared
            if (item_data.type == type.NULL) {
                // Save the variable 
                if (environment.get_variable(item.variable_id).type != type.NULL) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable ya inicializada: ' + item.variable_id));
                } else {
                    environment.save_variable(item.variable_id, item_data)
                }
                return
            }
            // if the save variable has an expression check types
            else {
                // Checking both types
                let checked = false
                if (item_data.type == this.native_type) {
                    checked = true
                }

                // if checked type save the variable
                if (!checked) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede iniciar con distinto tipo de dato para: ' + item.variable_id));
                } else {
                    // Save the variable 
                    if (environment.get_variable(item.variable_id).type != type.NULL) {
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable ya inicializada: ' + item.variable_id));
                    } else {
                        environment.save_variable(item.variable_id, item_data)
                    }
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