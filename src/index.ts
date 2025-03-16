import OpenAI from "openai";

const client = new OpenAI();

const completion = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "user",
      content: "Write a one-sentence joke about a cat.",
    },
  ],
});

console.log(completion.choices[0].message.content);
