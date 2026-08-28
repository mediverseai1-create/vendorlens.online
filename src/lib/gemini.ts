import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function analyzeVendorData(context: string, userMessage: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' })

  const prompt = `You are VendorLens AI, an expert vendor intelligence and third-party risk management assistant.

Organization's vendor data:
${context}

User question: ${userMessage}

Provide a helpful, accurate, business-focused response based on the data provided. Be concise and actionable. If the data doesn't contain enough information to answer fully, say so and suggest what data would help. Format your response clearly with bullet points or sections where appropriate.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}
