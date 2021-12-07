import { literal } from "../abstract/literal";
import { environment } from "../system/environment";
import { data, type } from "../system/type";

export class native extends literal {

    constructor(public value: any, public type: type, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {

        switch (this.type) {
            case type.INTEGER:
                return { value: Number(this.value), type: type.INTEGER };
            case type.FLOAT:
                return { value: Number(this.value), type: type.FLOAT };
            case type.STRING:
                return { value: this.get_string_value(this.value), type: type.STRING };
            case type.CHAR:
                return { value: this.get_string_value(this.value), type: type.CHAR };
            case type.NULL:
                return { value: null, type: type.NULL };
            case type.BOOLEAN:
                return { value: (this.value === 'false') ? false : true, type: type.BOOLEAN };
            default:
                return { value: this.value, type: type.STRING };
        }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }

}