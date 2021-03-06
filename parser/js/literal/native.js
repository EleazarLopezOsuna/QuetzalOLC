"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.native = void 0;
const literal_1 = require("../abstract/literal");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const error_1 = require("../system/error");
class native extends literal_1.literal {
    constructor(value, type, line, column) {
        super(line, column);
        this.value = value;
        this.type = type;
    }
    translate(environment) {
        switch (this.type) {
            case type_1.type.INTEGER:
            case type_1.type.FLOAT:
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = ' + this.value + ';\n';
                break;
            case type_1.type.STRING:
            case type_1.type.CHAR:
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = HP;//Save start position\n';
                let content = this.get_string_value(this.value);
                if (content !== "") {
                    for (let i = 0; i < content.length; i++) {
                        console_1._3dCode.output += 'HEAP[(int)HP] = ' + content.charAt(i).charCodeAt(0) + ';//Save character ' + content.charAt(i) + ' in heap\n';
                        console_1._3dCode.output += 'HP = HP + 1;//Increase HP\n';
                    }
                }
                console_1._3dCode.output += 'HEAP[(int)HP] = 36;//Save end of string in heap\n';
                console_1._3dCode.output += 'HP = HP + 1;//Increase HP\n';
                break;
            case type_1.type.NULL:
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' =  -1;\n';
                break;
            case type_1.type.BOOLEAN:
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += (this.value === 'false') ? 'T' + console_1._3dCode.actualTemp + ' = 0;\n' : 'T' + console_1._3dCode.actualTemp + ' = 1;\n';
                break;
            default:
                console.log(this.value);
                return type_1.type.STRING;
        }
        return this.type;
    }
    execute(environment) {
        switch (this.type) {
            case type_1.type.INTEGER:
                return { value: Number(this.value), type: type_1.type.INTEGER };
            case type_1.type.FLOAT:
                return { value: Number(this.value), type: type_1.type.FLOAT };
            case type_1.type.STRING:
                return { value: this.parse_string(this.get_string_value(this.value), environment), type: type_1.type.STRING };
            case type_1.type.CHAR:
                return { value: this.get_string_value(this.value), type: type_1.type.CHAR };
            case type_1.type.NULL:
                return { value: null, type: type_1.type.NULL };
            case type_1.type.BOOLEAN:
                return { value: (this.value === 'false') ? false : true, type: type_1.type.BOOLEAN };
            default:
                return { value: this.value, type: type_1.type.STRING };
        }
    }
    parse_string(str, environment) {
        const templateMatcher = /\$\s?([^{}\s]*)\s?/g;
        let text = str.replace(templateMatcher, (substring, value, index) => {
            let new_value_data = environment.get_variable(value);
            if (new_value_data.type == type_1.type.UNDEFINED) {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable no definida: ' + value));
                return "";
            }
            return new_value_data.value;
        });
        return text;
    }
    plot(count) {
        let plot_val = this.value;
        switch (this.type) {
            case type_1.type.INTEGER:
                plot_val = Number(this.value);
            case type_1.type.FLOAT:
                plot_val = Number(this.value);
            case type_1.type.STRING:
                plot_val = this.get_string_value(this.value);
            case type_1.type.CHAR:
                plot_val = this.get_string_value(this.value);
            case type_1.type.NULL:
                plot_val = "NULL";
            case type_1.type.BOOLEAN:
                plot_val = (this.value === 'false') ? false : true;
        }
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Nativo (" + plot_val + "," + type_1.type[this.type] + ")\"];";
        return result;
    }
}
exports.native = native;
//# sourceMappingURL=native.js.map