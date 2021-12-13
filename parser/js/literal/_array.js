"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._array = void 0;
const type_1 = require("../system/type");
const literal_1 = require("../abstract/literal");
class _array extends literal_1.literal {
    constructor(body, line, column) {
        super(line, column);
        this.body = body;
    }
    translate(environment) {
        // Default
        return type_1.type.NULL;
    }
    check_dimensions_number(dimensions) {
        let checked = false;
        if (dimensions.length == 1 && !(this.body[0] instanceof _array)) {
            checked = true;
        }
        else {
            let body_pointer = this.body;
            let dimensions_counter = 1;
            while (body_pointer[0] instanceof _array) {
                body_pointer = body_pointer[0].body;
                dimensions_counter++;
            }
            if (dimensions_counter == dimensions.length) {
                checked = true;
            }
        }
        return checked;
    }
    check_dimensions_length(dimensions, environment) {
        let body_pointer = this.body;
        let dimensions_counter = 0;
        while (body_pointer[0] instanceof _array) {
            let dimension_data = dimensions[dimensions_counter].execute(environment);
            if (dimension_data.type != type_1.type.INTEGER || dimension_data.value >= body_pointer.length
                || dimension_data.value < 0) {
                return false;
            }
            dimensions_counter++;
            body_pointer = body_pointer[0].body;
        }
        let dimension_data = dimensions[dimensions_counter].execute(environment);
        if (dimension_data.type != type_1.type.INTEGER || dimension_data.value >= body_pointer.length
            || dimension_data.value < 0) {
            return false;
        }
        return true;
    }
    get_by_index(dimensions, environment) {
        // get first data 
        let dimension_data = dimensions[0].execute(environment);
        dimensions.shift();
        // iterate trought the array and return the value
        let item = this.body[dimension_data.value];
        if (item instanceof _array) {
            return item.get_by_index(dimensions, environment);
        }
        else {
            return item.execute(environment);
        }
    }
    checkType(type, environment) {
        let return_bool = true;
        for (const item of this.body) {
            if (item instanceof _array) {
                return_bool = item.checkType(type, environment);
                // if one of all elements have another type return false
                if (!return_bool)
                    return false;
            }
            else {
                return_bool = (item.execute(environment).type == type);
                // if one of all elements have another type return false
                if (!return_bool)
                    return false;
            }
        }
        return return_bool;
    }
    to_string(environment) {
        let result_str = "[";
        for (const item of this.body) {
            if (item instanceof _array) {
                result_str += item.to_string(environment) + ",";
            }
            else {
                result_str += item.execute(environment).value + ",";
            }
        }
        // remove comma
        result_str = result_str.substring(0, result_str.length - 1);
        return result_str + "]";
    }
    execute(environment) {
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports._array = _array;
//# sourceMappingURL=_array.js.map