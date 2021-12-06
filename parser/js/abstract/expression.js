import { type_tbl } from "../system/type.js";
import { node } from "./node.js";
export class expression extends node {
    get_dominant_type(first_type, second_type) {
        return type_tbl[first_type][second_type];
    }
}
