
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeContract = async (base64Image: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Define the schema for structured JSON output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.STRING,
        description: '3-line summary of the contract suitable for a 10-year old.',
      },
      risks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            clause: { type: Type.STRING, description: 'The specific toxic or dangerous clause found.' },
            reason: { type: Type.STRING, description: 'Explanation of why this is risky for the signer.' }
          },
          required: ['clause', 'reason']
        },
        description: 'Up to 3 dangerous or toxic clauses found in the document.',
      },
      tips: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Practical tips for safe signing or positive clauses identified.',
      }
    },
    required: ['summary', 'risks', 'tips']
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image.split(',')[1] || base64Image
          }
        },
        {
          text: `당신은 베테랑 변호사입니다. 이미지 속 계약서를 분석해서 JSON 형식으로 답해주세요.
          1. summary: 전체 내용을 초등학생도 이해하게 3줄 요약.
          2. risks: '을(계약자)'에게 불리하거나 위험한 독소 조항 3가지를 찾아내고, 왜 위험한지 설명.
          3. tips: 안전하게 계약하기 위한 팁이나 긍정적인 조항.
          응답은 반드시 한국어로 작성해주세요.`
        }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: responseSchema,
      temperature: 0.2
    }
  });

  const result = JSON.parse(response.text || '{}');
  return result as AnalysisResult;
};
