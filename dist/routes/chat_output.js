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
            content: "You are an assistant that helps users understand selected text snippets from webpages. " +
                "Use the provided snippet and the page URL (for context only, not to display), and continue conversations naturally. " +
                "If the user asks for more information or refers to previous text, respond accordingly using the prior conversation. Unless prompted otherwise, keep response brief and concise."
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
        res.json({ response: resp });
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
