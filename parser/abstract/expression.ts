import { type, type_tbl } from "../system/type";
import { node } from "./node";

export abstract class expression extends node {

    public get_dominant_type(first_type: type, second_type: type): type {
        return type_tbl[first_type][second_type];
    }

}
