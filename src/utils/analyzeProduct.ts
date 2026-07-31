import * as ImageManipulator from 'expo-image-manipulator';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export async function analyzeProduct(imageUri: string) {
  if (!API_KEY) {
    throw new Error('Gemini API key is missing - check your .env file');
  }

  const manipulated = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 800 } }],
    { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true }
  );

  const base64Image = manipulated.base64;

  const prompt = 'Identify the product in this image (it may be a physical product/price tag photo, or a screenshot of an online listing). Based on your knowledge, estimate a realistic price range for this product in India, in Indian Rupees (INR, use the Rs symbol). Suggest 2-3 well-known Indian shopping sites where this type of product is commonly sold (like Amazon.in, Flipkart, Croma, Reliance Digital) with an estimated price on each - these are estimates, not live prices. Respond ONLY with valid JSON in this exact format, no other text, no markdown: {"product": "product name", "listedPrice": "price if visible in the image, in INR, or null", "verdict": "Great Deal or Fair Price or Overpriced or Unknown", "deals": [{"site": "website name", "price": "Rs X,XXX (est.)", "note": "brief note"}], "tips": ["tip 1", "tip 2", "tip 3"]}';

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64Image,
                },
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();
  console.log('API response:', JSON.stringify(data).substring(0, 500));

  if (data.error) {
    throw new Error(data.error.message);
  }

  const textContent = data.candidates[0].content.parts.find((p: any) => p.text)?.text;
  if (!textContent) {
    throw new Error('No text response from AI');
  }

  const cleaned = textContent.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}