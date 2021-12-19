"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variable_id = exports.variable_id_type = void 0;
const literal_1 = require("../abstract/literal");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const error_1 = require("../system/error");
var variable_id_type;
(function (variable_id_type) {
    variable_id_type[variable_id_type["NORMAL"] = 0] = "NORMAL";
    variable_id_type[variable_id_type["REFERENCE"] = 1] = "REFERENCE";
})(variable_id_type = exports.variable_id_type || (exports.variable_id_type = {}));
class variable_id extends literal_1.literal {
    constructor(id, type, line, column) {
        super(line, column);
        this.id = id;
        this.type = type;
    }
    translate(environment) {
        let return_data = environment.get_variable_recursive(this.id, environment);
        let absolute = environment.get_absolute_recursive(this.id, environment);
        let relative = environment.get_relative_recursive(this.id, environment);
        let symScope = environment.get_scope_recursive(this.id, environment);
        if (return_data.type != type_1.type.NULL) {
            console_1._3dCode.actualTemp++;
            let posVar = console_1._3dCode.actualTemp;
            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + ' + relative + ';\n';
            console_1._3dCode.actualTemp++;
            console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + posVar + '];//Getting value of variable ' + this.id + '\n';
            return return_data.type;
        }
        else {
        }
        return type_1.type.NULL;
    }
    execute(environment) {
        let return_data = environment.get_variable(this.id);
        if (return_data.type != type_1.type.UNDEFINED) {
            return return_data;
        }
        else {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable no definida: ' + this.id));
        }
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Nativo (" + this.id + "," + variable_id_type[this.type] + ")\"];";
        return result;
    }
}
exports.variable_id = variable_id;
//# sourceMappingURL=variable_id.js.map