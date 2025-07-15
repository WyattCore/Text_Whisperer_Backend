import express, { response, Router } from 'express';
import OpenAI from 'openai';
import { get_selected_input, get_src_url } from '../selected_text-state';
import { getSelectionRange } from '@testing-library/user-event/dist/utils';
import { Content } from 'openai/resources/containers/files/content';
import { ChatCompletionMessageParam, ChatCompletionRunner } from "openai/resources/chat/completions";

const router = express.Router()

const openai = new OpenAI({apiKey: process.env.text_whisperer_key});
let history: { [key: string]: any } = {};

router.get('/', async(req:any, res:any)=>{
    try{
        const system_message: ChatCompletionMessageParam = {
            role: "system",
            content:
                "You are an assistant that helps users understand selected text snippets from webpages. " +
                "Use the provided snippet and the page URL (for context only, not to display), and continue conversations naturally. " +
                "If the user asks for more information or refers to previous text, respond accordingly using the prior conversation. Unless prompted otherwise, keep response brief and concise."
        };

        const message_history: ChatCompletionMessageParam[] = Object.entries(history).flatMap(([q, a]) => [
            {role: "user", content:q},
            {role: "assistant", content: a}
        ]); 
        const latest_message: ChatCompletionMessageParam = {
            role: "user",
            content: `${get_selected_input()}\n\n(Page context: ${get_src_url()})`       }
        
            const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [system_message, ...message_history, latest_message]
        });
        
        const resp = completion.choices[0].message.content;
        res.json({response: resp});
        const inp = get_selected_input();
        if(typeof inp === "string"){
            history[inp] = resp;
        }
    }catch (error){
        console.error("Error calling opeanai API", error);
        res.status(500).json({error: "could not get response from Openai"});
    }
    });

export default router;