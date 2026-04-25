const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/', async (req, res) => {
    try {
        const { message } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(200).json({ reply: "I'm currently running in offline mode. Please add a GEMINI_API_KEY to the backend .env file to enable AI responses!" });
        }

        const prompt = `You are UniNexus Assistant, an AI chatbot for a university marketplace called UniNexus. 
You help students register, log in, buy, and sell products (like laptops, books, bikes).
Be concise, helpful, and friendly. Do not use markdown.
User asks: ${message}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ reply: "Sorry, I'm having trouble connecting to my AI brain right now. Please try again later." });
    }
});

module.exports = router;
