import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { HALAL_KNOWLEDGE_BASE, KnowledgeDocument } from './knowledgeBase';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (language: string): string => {
    switch (language) {
        case 'id':
            return "Anda adalah HANA, Penasihat Halal AI yang ramah dan membantu dari BPJPH. Tujuan Anda adalah membantu pengguna dengan pertanyaan mereka tentang produk Halal, sertifikasi, bahan, dan layanan BPJPH. Berikan jawaban yang ringkas, jelas, dan selalu pertahankan nada yang sopan dan mendukung. Jawab dalam Bahasa Indonesia.";
        case 'ar':
            return "أنت HANA، مستشار حلال ذكاء اصطناعي ودود ومتعاون من BPJPH. هدفك هو مساعدة المستخدمين في أسئلتهم حول المنتجات الحلال والشهادات والمكونات وخدمات BPJPH. كن موجزًا وواضحًا وحافظ دائمًا على نبرة محترمة وداعمة. أجب باللغة العربية.";
        case 'en':
        default:
            return "You are HANA, a friendly and helpful AI Halal Advisor from BPJPH. Your goal is to assist users with their questions about Halal products, certification, ingredients, and BPJPH services. Be concise, clear, and always maintain a respectful and supportive tone. Answer in English.";
    }
};

/**
 * Finds relevant documents from the knowledge base based on the user's query.
 * This is a simple keyword-based retrieval method.
 * @param query The user's message.
 * @param language The current language of the user.
 * @returns An array of relevant knowledge documents.
 */
function findRelevantDocuments(query: string, language: string): KnowledgeDocument[] {
    const knowledgeBaseForLang = HALAL_KNOWLEDGE_BASE[language] || HALAL_KNOWLEDGE_BASE['en'];
    const lowerQuery = query.toLowerCase();
    const queryWords = lowerQuery.split(/\s+/);
    
    // Check for specific keywords that should prioritize regulation documents
    const regulationKeywords = ['regulation', 'law', 'uu', 'pp', 'legal', 'rules', 'regulasi', 'hukum', 'undang-undang', 'peraturan', 'قانون', 'لائحة', 'تشريع'];
    const isRegulationQuery = regulationKeywords.some(kw => lowerQuery.includes(kw));

    const scoredDocs = knowledgeBaseForLang.map(doc => {
        let score = 0;
        const contentWords = new Set(doc.content.toLowerCase().split(/\s+/));
        const titleWords = new Set(doc.title.toLowerCase().split(/\s+/));

        queryWords.forEach(word => {
            if (doc.keywords.includes(word)) {
                score += 5; // High score for keyword match
            }
            if (titleWords.has(word)) {
                score += 3; // Medium score for title match
            }
            if (contentWords.has(word)) {
                score += 1; // Low score for content match
            }
        });

        // Boost score for regulation documents if the query seems to be about regulations
        if (isRegulationQuery && doc.keywords.some(kw => regulationKeywords.includes(kw))) {
            score += 10;
        }

        return { ...doc, score };
    });

    // Filter out docs with no score and sort by score descending
    const relevantDocs = scoredDocs
        .filter(doc => doc.score > 2) // Require a minimum score to be considered relevant
        .sort((a, b) => b.score - a.score);

    // Return top 2 relevant documents
    return relevantDocs.slice(0, 2);
}


/**
 * Creates a new stateful chat session with the Gemini model.
 * @param language The language code ('en', 'id', 'ar').
 * @returns A Chat instance.
 */
export function createHanaChat(language: string): Chat {
    const modelConfig = {
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: getSystemInstruction(language),
        },
    };
    return ai.chats.create(modelConfig);
}

/**
 * Sends a message to the Gemini model within a chat session, using RAG.
 * @param chat The Chat instance for the current session.
 * @param message The user's message.
 * @param language The current language of the user.
 * @returns The model's text response.
 * @throws Will throw an error if the API call fails.
 */
export async function sendMessageToHana(chat: Chat, message: string, language: string): Promise<string> {
    try {
        // 1. Retrieve relevant documents from the knowledge base in the correct language
        const relevantDocs = findRelevantDocuments(message, language);

        let finalMessage = message;

        // 2. Augment the prompt if relevant documents are found
        if (relevantDocs.length > 0) {
            const contextLabels = {
                'en': { title: 'Title', content: 'Content' },
                'id': { title: 'Judul', content: 'Isi' },
                'ar': { title: 'العنوان', content: 'المحتوى' }
            };
            const labels = contextLabels[language as keyof typeof contextLabels] || contextLabels['en'];

            const context = relevantDocs
                .map(doc => `${labels.title}: ${doc.title}\n${labels.content}: ${doc.content}`)
                .join('\n\n---\n\n');
            
            const augmentationPrompts: { [key: string]: string } = {
                'en': `Based on the following information, answer the user's question. If the information isn't relevant, answer the question based on your general knowledge.\n\n[CONTEXT]\n${context}\n\n[USER QUESTION]\n${message}`,
                'id': `Berdasarkan informasi berikut, jawab pertanyaan pengguna. Jika informasi tidak relevan, jawab pertanyaan berdasarkan pengetahuan umum Anda.\n\n[KONTEKS]\n${context}\n\n[PERTANYAAN PENGGUNA]\n${message}`,
                'ar': `بناءً على المعلومات التالية، أجب عن سؤال المستخدم. إذا كانت المعلومات غير ذات صلة، فأجب عن السؤال بناءً على معرفتك العامة.\n\n[السياق]\n${context}\n\n[سؤال المستخدم]\n${message}`
            };

            finalMessage = augmentationPrompts[language] || augmentationPrompts['en'];
        }

        // 3. Send the (potentially augmented) message to the model
        const response: GenerateContentResponse = await chat.sendMessage({ message: finalMessage });
        
        // 4. Return the text response
        return response.text;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // Re-throw the error to be handled by the calling UI component
        throw error;
    }
}