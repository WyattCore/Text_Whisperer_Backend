import { response } from "express";
import OpenAI from "openai";
import dotenv from "dotenv"
import { error } from "console";
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
let input: string = "";
dotenv.config()
const api_key = process.env.text_whisperer_key;

import selected_text_route from './routes/selected_text';
import chat_response_route from './routes/chat_output';



app.use(cors());
app.use(express.json())
app.use('/selected_text', selected_text_route);
app.use('/chat_output', chat_response_route);


if (!api_key){
    console.error(process.env)
    console.error("API KEY missing.")
    process.exit(1);
}


app.get('/', async(req:any, res:any) =>{
    try{
        res.send(
            {
                "request": req,
                "selected_text": "/selected_text",
                "chatGPT Response": "/chat_output"
            }
        );
    }catch(error){
        console.log("error at welcome: ", error);
    }
});

app.listen(PORT, ()=>{
    console.log("Sever running on port ", PORT)
});