import express from 'express';
const router = express.Router()
import { get_selected_input, set_selected_input, get_src_url, set_src_url } from '../selected_text-state';

router.post('/', async(req:any, res:any) => {
    try{
        const {input, source } = req.body;
        console.log(input);
        if (!input) {
            return res.status(400).json({error: "Missing input in req body."});
        }
        set_selected_input(input);
        set_src_url(source);
        console.log("received selected_text:", input);
        console.log("received url: ", source);
        res.status(200).json({message: "input recieved successfully", input: get_selected_input(), source: get_src_url()});
    }catch(error){
        console.log("Error in selected_text route : ", error);
        res.status(500).json({error: "Internal server error"});
    }
});


router.get('/', (req:any, res:any) =>{
    res.send({selected_text: get_selected_input(), "src_url": get_src_url  })
});

export default router;  