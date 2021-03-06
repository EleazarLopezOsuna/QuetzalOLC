import { literal } from "../abstract/literal";
import { environment } from "../system/environment";
import { data, type } from "../system/type";
import { _3dCode } from "../system/console";
import { error, error_arr, error_type } from "../system/error";

export class native extends literal {

    public translate(environment: environment): type {
        switch (this.type) {
            case type.INTEGER:
            case type.FLOAT:
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = ' + this.value + ';\n';
                break;
            case type.STRING:
            case type.CHAR:
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = HP;//Save start position\n';
                let content = this.get_string_value(this.value);
                if (content !== "") {
                    for (let i = 0; i < content.length; i++) {
                        _3dCode.output += 'HEAP[(int)HP] = ' + content.charAt(i).charCodeAt(0) + ';//Save character ' + content.charAt(i) + ' in heap\n';
                        _3dCode.output += 'HP = HP + 1;//Increase HP\n';
                    }
                }
                _3dCode.output += 'HEAP[(int)HP] = 36;//Save end of string in heap\n';
                _3dCode.output += 'HP = HP + 1;//Increase HP\n';
                break;
            case type.NULL:
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' =  -1;\n';
                break;
            case type.BOOLEAN:
                _3dCode.actualTemp++;
                _3dCode.output += (this.value === 'false') ? 'T' + _3dCode.actualTemp + ' = 0;\n' : 'T' + _3dCode.actualTemp + ' = 1;\n'
                break;
            default:
                console.log(this.value)
                return type.STRING;
        }
        return this.type;
    }

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
                return { value: this.parse_string(this.get_string_value(this.value), environment), type: type.STRING };
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

    private parse_string(str: String, environment: environment):string {
        const templateMatcher = /\$\s?([^{}\s]*)\s?/g;
        let text = str.replace(templateMatcher, (substring, value, index) => {
            let new_value_data = environment.get_variable(value);
            if (new_value_data.type == type.UNDEFINED) {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable no definida: ' + value));
                return ""
            }
            return new_value_data.value;
        });
        return text
    }

    public plot(count: number): string {
        let plot_val: any = this.value
        switch (this.type) {
            case type.INTEGER:
                plot_val = Number(this.value);
            case type.FLOAT:
                plot_val = Number(this.value);
            case type.STRING:
                plot_val = this.get_string_value(this.value);
            case type.CHAR:
                plot_val = this.get_string_value(this.value);
            case type.NULL:
                plot_val = "NULL";
            case type.BOOLEAN:
                plot_val = (this.value === 'false') ? false : true;
        }

        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Nativo (" + plot_val + "," + type[this.type] + ")\"];";

        return result
    }

}