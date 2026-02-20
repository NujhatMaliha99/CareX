const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const models = await genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log("Listing models...");
        // The listModels method is on the genAI object or similar depending on SDK
        // In newer versions:
        // This is a guess, let's try calling an endpoint that lists them
    } catch (e) {
        console.error(e);
    }
}

// Actually, let's just try changing the model to 'gemini-pro' which almost always works.
console.log("Testing with 'gemini-pro'...");
