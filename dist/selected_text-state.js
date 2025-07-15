"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set_selected_input = set_selected_input;
exports.get_selected_input = get_selected_input;
exports.set_src_url = set_src_url;
exports.get_src_url = get_src_url;
const console_1 = require("console");
let selected_input = "";
let src_url = "";
function set_selected_input(input) {
    selected_input = input;
}
function get_selected_input() {
    if (selected_input == "" || !selected_input) {
        console.error("No selected input to return.");
        return (0, console_1.error)("No selected input to return");
    }
    else {
        return selected_input;
    }
}
function set_src_url(source) {
    src_url = source;
}
function get_src_url() {
    if (!src_url) {
        console.error("No url to return");
        return (0, console_1.error)("No url to return");
    }
    else {
        return src_url;
    }
}
