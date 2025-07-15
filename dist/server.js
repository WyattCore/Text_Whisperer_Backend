"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
let input = "";
dotenv_1.default.config();
const api_key = process.env.text_whisperer_key;
const selected_text_1 = __importDefault(require("./routes/selected_text"));
const chat_output_1 = __importDefault(require("./routes/chat_output"));
app.use(cors());
app.use(express.json());
app.use('/selected_text', selected_text_1.default);
app.use('/chat_output', chat_output_1.default);
if (!api_key) {
    console.error(process.env);
    console.error("API KEY missing.");
    process.exit(1);
}
app.get('/', async (req, res) => {
    try {
        res.send({
            "selected_text": "/selected_text",
            "chatGPT Response": "/chat_output"
        });
    }
    catch (error) {
        console.log("error at welcome: ", error);
    }
});
app.listen(PORT, () => {
    console.log("Sever running on port ", PORT);
});
