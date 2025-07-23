"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const selected_text_state_1 = require("../selected_text-state");
router.post('/', async (req, res) => {
    try {
        const { input, source } = req.body;
        console.log(input);
        if (!input) {
            return res.status(400).json({ error: "Missing input in req body." });
        }
        (0, selected_text_state_1.set_selected_input)(input);
        (0, selected_text_state_1.set_src_url)(source);
        console.log("received selected_text:", input);
        console.log("received url: ", source);
        res.status(200).json({ message: "input recieved successfully", input: (0, selected_text_state_1.get_selected_input)(), source: (0, selected_text_state_1.get_src_url)() });
    }
    catch (error) {
        console.log("Error in selected_text route : ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.get('/', (req, res) => {
    res.send({ selected_text: (0, selected_text_state_1.get_selected_input)(), src_url: (0, selected_text_state_1.get_src_url)() });
});
exports.default = router;
