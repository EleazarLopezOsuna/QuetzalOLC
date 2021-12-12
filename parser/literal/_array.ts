import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _3dCode } from "../system/console";
import { literal } from "../abstract/literal";

export class _array extends literal {
    public translate(environment: environment): type {
        // Default
        return type.NULL
    }

    constructor(public body: Array<_array> | Array<expression> | Array<literal>, line: number, column: number) {
        super(line, column);
    }

    public checkType(type: type, environment: environment): boolean {
        let return_bool = true;
        for (const item of this.body) {
            if (item instanceof _array) {
                return_bool = item.checkType(type, environment)
                // if one of all elements have another type return false
                if (!return_bool) return false;
            } else {
                return_bool = (item.execute(environment).type == type)
                // if one of all elements have another type return false
                if (!return_bool) return false;
            }
        }
        return return_bool;
    }

    public execute(environment: environment): data {
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}