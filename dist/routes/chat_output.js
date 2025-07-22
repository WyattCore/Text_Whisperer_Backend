"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const openai_1 = __importDefault(require("openai"));
const selected_text_state_1 = require("../selected_text-state");
const router = express_1.default.Router();
const openai = new openai_1.default({ apiKey: process.env.text_whisperer_key });
let history = {};
router.get('/', async (req, res) => {
    try {
        const system_message = {
            role: "system",
            content: "You are a text analysis assistant. You help users understand selected webpage snippets." +
                "CONTEXT: You'll receive a text snippet and URL (for context only - don't display the URL)." +
                "INSTRUCTIONS: 1) Answer questions about the provided text snippet. 2) Reference previous conversation when relevant 3) Keep responses brief unless asked for detail" +
                "4) CRITICAL: Always format your response in valid HTML markup - this affects how it displays. SO ONLY RESPOND IN valid HTML markup, WHERE EACH PART OF TEXT IS WRAPPED IN SOME HTML ELEMENT" +
                "Continue conversations naturally based on user questions and prior context. So basically you are returning html elements: examples of wrong and right shown here: " +
                "WRONG: ```html <p>content</p> ```       or   WRONG: To do X, you can use: <div>example</div>" +
                "RIGHT:   <p>content/response</p>      or <div>content</div>     or <li><p>content</p><p>more content</p></li>" +
                "RESPONSE FORMAT: Always return valid HTML elements that will be inserted via innerHTMl " +
                "HTML EXAMPLES: When user asks about HTML elements/code, they need to SEE the code." +
                "Use HTML entities or <code> tags to display HTML without rendering it:" +
                "CORRECT: <p>To create a paragraph, use: <code>&lt;p&gt;your text&lt;/p&gt;</code></p>" +
                "CORRECT: <p>The div element looks like: <code>&lt;div class=`example`&gt;content&lt;/div&gt;</code></p>" +
                " WRONG: <p>Use <p>your text</p> for paragraphs</p>" +
                "(This would create nested paragraphs and break)" +
                "KEY RULE: If showing HTML code as an example, escape it with &lt; &gt; or wrap in <code> tags so the user can see the actual markup instead of it being rendered."
        };
        const message_history = Object.entries(history).flatMap(([q, a]) => [
            { role: "user", content: q },
            { role: "assistant", content: a }
        ]);
        const latest_message = {
            role: "user",
            content: `${(0, selected_text_state_1.get_selected_input)()}\n\n(Page context: ${(0, selected_text_state_1.get_src_url)()})`
        };
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [system_message, ...message_history, latest_message]
        });
        const resp = completion.choices[0].message.content;
        res.json({
            response: resp,
            chat_history: message_history
        });
        const inp = (0, selected_text_state_1.get_selected_input)();
        if (typeof inp === "string") {
            history[inp] = resp;
        }
    }
    catch (error) {
        console.error("Error calling opeanai API", error);
        res.status(500).json({ error: "could not get response from Openai" });
    }
});
exports.default = router;
