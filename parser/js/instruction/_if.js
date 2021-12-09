"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._if = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
class _if extends expression_1.expression {
    constructor(condition, code, else_statement, line, column) {
        super(line, column);
        this.condition = condition;
        this.code = code;
        this.else_statement = else_statement;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        var _a;
        const condition = this.condition.execute(environment);
        if (condition.type != type_1.type.BOOLEAN) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'La condicion del if tiene que ser booleana'));
        }
        if (condition.value == true) {
            return this.code.execute(environment);
        }
        else {
            return (_a = this.else_statement) === null || _a === void 0 ? void 0 : _a.execute(environment);
        }
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports._if = _if;
//# sourceMappingURL=_if.js.map