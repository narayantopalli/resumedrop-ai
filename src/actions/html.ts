'use server';

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const plainTextToHtml = async (text: string) => {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {role: "system", content: `
                You are a helpful parser that converts plain text to html.
                Do not change the content of the text in any way, and do not lose any information.
                Convert the plain text into nicely formatted html.
                The html should be well structured and easy to read.
                Use lists to improve readability!
                The html should not contain a style tag or any other tags that are not part of the html standard.
                Your response should be in the following format:
                <html>
                    <body>
                        ///HTML CODE HERE///
                    </body>
                </html>
            `},
            { role: "user", content: text }
        ],
        max_tokens: 2000,
        temperature: 0.1
    });
    return response.choices[0].message.content;
};
