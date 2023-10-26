const express = require("express");
require("dotenv").config();
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

app.post("/convert", async (req, res) => {
    const { code, fromLanguage, toLanguage } = req.body;
    try {
        
        const response = await axios.post(
            "https://api.openai.com/v1/engines/text-davinci-003/completions",
            {
                prompt: `Convert the following ${code} from ${fromLanguage} to ${toLanguage}`,
                max_tokens: 100,
                temperature: 1
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPEN_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const translatedCode = response.data.choices[0].text.trim();
        res.json({ translatedCode });
    } catch (error) {
        console.error("Error:", error?.response?.data);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.get("/", (req, res) => {
    res.send("Code Converter App");
});

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});
