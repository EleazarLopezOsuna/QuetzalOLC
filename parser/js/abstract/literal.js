"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.literal = void 0;
const node_1 = require("./node");
class literal extends node_1.node {
    get_string_value(str) {
        let result = str;
        if (str.endsWith('"'))
            result = str.replace(/\"/g, "");
        if (str.endsWith("'"))
            result = str.replace(/\'/g, "");
        result = result.replace(/\\t/g, '  ');
        result = result.replace(/\\n/g, '\n');
        result = result.replace(/\\r/g, '\n');
        return result;
    }
}
exports.literal = literal;
