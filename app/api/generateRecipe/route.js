import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const { items } = await req.json();
    const prompt = `Create a recipe using the following ingredients: ${items.join(', ')}. Be sure to specify what extra ingredients are needed and the steps to make the recipe.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    });

    const recipe = response.choices[0].message.content;
    return new Response(JSON.stringify({ recipe }), { status: 200 });
  } catch (error) {
    console.error('Error generating recipe:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
