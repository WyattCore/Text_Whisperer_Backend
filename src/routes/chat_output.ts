import express, { response, Router } from 'express';
import OpenAI from 'openai';
import { get_selected_input, get_src_url } from '../selected_text-state';
// import { getSelectionRange } from '@testing-library/user-event/dist/utils';
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
                "You are a text analysis assistant. You help users understand selected webpage snippets." +
                "CONTEXT: You'll receive a text snippet and URL (for context only - don't display the URL)." +
                "INSTRUCTIONS: 1) Answer questions about the provided text snippet. 2) Reference previous conversation when relevant 3) Keep responses brief unless asked for detail" +
                "4) CRITICAL: Always format your response in valid HTML markup - this affects how it displays. SO ONLY RESPOND IN valid HTML markup, WHERE EACH PART OF TEXT IS WRAPPED IN SOME HTML ELEMENT" +
                "Continue conversations naturally based on user questions and prior context. So basically you are returning html elements: examples of wrong and right shown here: " +
                "WRONG: ```html <p>content</p> ```       or   WRONG: To do X, you can use: <div>example</div>" +
                "RIGHT:   <p>content/response</p>      or <div>content</div>     or <li><p>content</p><p>more content</p></li>" +
                "RESPONSE FORMAT: Always return valid HTML elements that will be inserted via innerHTMl "+
                "HTML EXAMPLES: When user asks about HTML elements/code, they need to SEE the code." +
                "Use HTML entities or <code> tags to display HTML without rendering it:" +
                "CORRECT: <p>To create a paragraph, use: <code>&lt;p&gt;your text&lt;/p&gt;</code></p>" +
                "CORRECT: <p>The div element looks like: <code>&lt;div class=`example`&gt;content&lt;/div&gt;</code></p>" +
                " WRONG: <p>Use <p>your text</p> for paragraphs</p>" +
                "(This would create nested paragraphs and break)" +
                "KEY RULE: If showing HTML code as an example, escape it with &lt; &gt; or wrap in <code> tags so the user can see the actual markup instead of it being rendered." 
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
        res.json({
            response: resp,
            chat_history: message_history
        });
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
