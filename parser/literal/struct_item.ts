import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { data, type } from "../system/type";
import { _3dCode } from "../system/console";
import { literal } from "../abstract/literal";
import { _struct } from "./_struct";

export class struct_item extends literal {
    public translate(environment: environment): type {
        // Default
        return type.NULL
    }

    public get_value(property: string, environment: environment): expression | literal | null {
        let parent_struct = environment.get_variable(this.parent_struct_id).value
        if (parent_struct instanceof _struct) {
            const parameters = parent_struct.body
            for (let index = 0; index < this.body.length; index++) {
                const obtained_parameter_data = parameters[index].execute(environment)
                if (obtained_parameter_data.value == property) {
                    return this.body[index]
                }
            }
        }
        return null
    }

    public to_string(environment: environment) {
        let param_list = ""
        this.body.forEach(element => {
            let element_data = element.execute(environment)
            param_list += element_data.value + ", "
        });
        param_list = param_list.slice(0, param_list.length - 2)
        return this.parent_struct_id + "(" + param_list + ")"
    }

    constructor(public body: Array<expression | literal>, public parent_struct_id: string, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        // Default
        return { value: this, type: type.UNDEFINED }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}