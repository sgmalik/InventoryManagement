import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req) {
  const { items } = await req.json();

  const prompt = `Create a recipe using the following ingredients: ${items.join(', ')}`;

  try {
    const response = await openai.createCompletion({
      model: 'gpt-4',
      prompt,
      max_tokens: 150,
    });

    const recipe = response.data.choices[0].text;
    return new Response(JSON.stringify({ recipe }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
