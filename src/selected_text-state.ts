import { error } from "console";

let selected_input = "";
let src_url = ""
export function set_selected_input(input:string){
    selected_input = input;
}

export function get_selected_input(){
    if (selected_input == "" || !selected_input){
        console.error("No selected input to return.")
        return error("No selected input to return")
    }else{
        return selected_input;
    }
    
}

export function set_src_url(source :any){
    src_url = source
}

export function get_src_url(){
    if(!src_url){
        console.error("No url to return");
        return error("No url to return");
    }else{
        return src_url;
    }
}