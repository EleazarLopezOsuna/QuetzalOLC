"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.struct_item = void 0;
const type_1 = require("../system/type");
const literal_1 = require("../abstract/literal");
class struct_item extends literal_1.literal {
    constructor(body, parent_struct_id, line, column) {
        super(line, column);
        this.body = body;
        this.parent_struct_id = parent_struct_id;
    }
    translate(environment) {
        // Default
        return type_1.type.NULL;
    }
    to_string(environment) {
        let param_list = "";
        this.body.forEach(element => {
            let element_data = element.execute(environment);
            param_list += element_data.value + ", ";
        });
        param_list = param_list.slice(0, param_list.length - 2);
        return this.parent_struct_id + "(" + param_list + ")";
    }
    execute(environment) {
        // Default
        return { value: this, type: type_1.type.UNDEFINED };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.struct_item = struct_item;
//# sourceMappingURL=struct_item.js.map