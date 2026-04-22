import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from "openai";
import z from "zod";

// Goes inside of .env file and reads all variables delcared and stores them before running
dotenv.config();

// Grabbing OpenAI key
const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY
});

const app = express();
// returns middleware function that gets executed before passing request to request handler
app.use(express.json());
// env is enviornment
const port = process.env.PORT || 3000;

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});

app.get('/', (req: Request, res: Response) => {
   res.send(process.env.OPENAI_API_KEY);
});


// Wrap handler
app.get('/api/hello', (req: Request, res: Response) => {
   res.json({message: "Hello world"});
});


let lastResponseId: string | null = null;
// map conversationId -> lastResponseId
// conv1 -> ID: 100
// conv2 -> ID: 200
const conversations = new Map<string, string>();


const chatSchema = z.object({
   prompt: z.string()
      // gets rid of whitespace at string
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt is too long (Max is 1000 characters)'),
      // uuid stands for universally identifier
   conversationId: z.string().uuid()
});


// MAIN PART - THIS IS WHAT IS USED FOR THE CHAT BOT WITH POSTMAN
app.post('/api/chat', async (req: Request, res: Response) => {

   const parseResult = chatSchema.safeParse(req.body);
   // json middleware gets requested before request handler, parses it and stores it below in req.body
   const {prompt, conversationId} = req.body;



   // catches error: 
   try {
   // response
   const response = await client.responses.create({
      model: 'gpt-5.4-mini',
      input: prompt,
      temperature: 0.3,
      max_output_tokens: 100,
      previous_response_id: conversations.get(conversationId)
   });

      conversations.set(conversationId, response.id);
      // returns json object to client
      res.json({message: response.output_text})


   // saves chat interaction so it remembers conversation
   lastResponseId = response.id;

   } catch (error) {
      res.status(500).json({ error: 'Failed to generate a response'})
   }


   if(!parseResult.success) {
      res.status(400).json(parseResult.error.format());
      return;

   }


});