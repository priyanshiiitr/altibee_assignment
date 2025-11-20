// OpenAI integration for AI-powered question generation following the javascript_openai blueprint
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateProductQuestions(
  productName: string,
  category: string,
  brand?: string,
  description?: string
): Promise<Array<{ id: string; question: string; category: string; tooltip?: string }>> {
  try {
    const prompt = `You are an expert in product transparency and ethical consumerism. Generate 6-8 intelligent, specific follow-up questions to gather comprehensive information about a product for a transparency report.

Product Details:
- Name: ${productName}
- Category: ${category}
${brand ? `- Brand: ${brand}` : ""}
${description ? `- Description: ${description}` : ""}

Generate questions that cover these areas:
1. Ingredients/Materials (what's in it?)
2. Sourcing & Supply Chain (where does it come from?)
3. Environmental Impact (how is it made and disposed of?)
4. Health & Safety (is it safe to use?)
5. Certifications & Standards (what third-party validations exist?)
6. Company Ethics (who makes it and what are their values?)

Make questions specific to this product category. Return a JSON array with this structure:
{
  "questions": [
    {
      "id": "unique-id",
      "question": "The question text",
      "category": "Ingredients" | "Sourcing" | "Environmental" | "Health" | "Certifications" | "Ethics",
      "tooltip": "Optional: Why we ask this question (1 sentence)"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert in product transparency, sustainability, and consumer health. Generate thoughtful, specific questions that help assess product transparency.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.questions || [];
  } catch (error) {
    console.error("Error generating questions:", error);
    // Fallback to basic questions if AI fails
    return [
      {
        id: "ingredients",
        question: "What are the main ingredients or materials in this product?",
        category: "Ingredients",
        tooltip: "Understanding what's in the product helps assess safety and quality",
      },
      {
        id: "sourcing",
        question: "Where are the ingredients/materials sourced from?",
        category: "Sourcing",
        tooltip: "Supply chain transparency is key to ethical consumption",
      },
      {
        id: "certifications",
        question: "Does this product have any certifications (organic, fair trade, etc.)?",
        category: "Certifications",
        tooltip: "Third-party certifications validate ethical and quality claims",
      },
      {
        id: "environmental",
        question: "What environmental practices does the manufacturer follow?",
        category: "Environmental",
        tooltip: "Environmental impact affects sustainability",
      },
      {
        id: "packaging",
        question: "What type of packaging is used and is it recyclable?",
        category: "Environmental",
        tooltip: "Packaging waste contributes significantly to environmental impact",
      },
    ];
  }
}

export async function calculateTransparencyScore(
  responses: Array<{ question: string; answer: string; category?: string }>
): Promise<number> {
  try {
    const prompt = `As a product transparency expert, analyze these product responses and calculate an overall transparency score (0-100).

Consider:
- Completeness of information (how detailed are the answers?)
- Transparency indicators (specific data, certifications, verifiable claims)
- Red flags (vague answers, missing critical info, contradictions)

Responses:
${responses.map((r, i) => `${i + 1}. Q: ${r.question}\n   A: ${r.answer}`).join("\n\n")}

Return JSON: { "score": number (0-100), "reasoning": "brief explanation" }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert in evaluating product transparency and ethical business practices.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return Math.max(0, Math.min(100, result.score || 50));
  } catch (error) {
    console.error("Error calculating transparency score:", error);
    // Simple fallback: average based on answer length and completeness
    const avgLength = responses.reduce((sum, r) => sum + r.answer.length, 0) / responses.length;
    return Math.min(100, Math.round((avgLength / 100) * 100));
  }
}
