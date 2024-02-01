import OpenAI from "openai";
import {ChatCompletionAssistantMessageParam, ChatCompletionCreateParamsBase} from "openai/resources/chat/completions";
import {Chat} from "openai/resources";
import ChatCompletion = Chat.ChatCompletion;
import { OPENAI_API_KEY } from "./config";
import ChatCompletionRole = Chat.ChatCompletionRole;

const parameters: ChatCompletionCreateParamsBase = {
    n: 1,
    top_p: 1,
    temperature: 1,
    max_tokens: 1000,
    stream: false,
    model: 'gpt-4-1106-preview',
    messages: [],
    functions: [
        {
            name: 'answerSentiment',
            description: 'Always respond to sentiment questions using this function call.',
            parameters: {
                type: 'object',
                properties: {
                    sentiment: {
                        type: 'string',
                        description: 'Sentiment of the text.',
                        enum: ['positive', 'neutral', 'negative'],
                    },
                },
            },
        },
    ],
};

export type ChatResponse = null | {
    content: null | string;
    functionCall: null | ChatCompletionAssistantMessageParam.FunctionCall;
}

const extractFirstChoice = (msg: OpenAI.Chat.Completions.ChatCompletion): ChatResponse => {
    const firstChoice = msg?.choices?.[0]?.message;

    if (!firstChoice) {
        return null;
    }
    return {
        content: firstChoice.content ?? null,
        functionCall: firstChoice.function_call ?? null,
    }
}

export class OpenAiChat {
    private readonly openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
    });
    private readonly messages:  OpenAI.Chat.Completions.ChatCompletionMessageParam[];

    constructor(system:string) {
        this.messages = [
            {
                role: 'system',
                content: system,
            }
        ]
    }
// stosujemy 'any' a nie 'string'. gdyż możemy chcieć zwrócić obiekt
    async say(
        prompt: string,
        role: ChatCompletionRole = 'user',
        functionName?: string,
    ): Promise<any | null> {
        this.messages.push({
            role,
            content: prompt,
            name: functionName,
        } as ChatCompletionAssistantMessageParam);

        const data = await this.openai.chat.completions.create({
            ...parameters,
            messages: this.messages,
        })

        const s = extractFirstChoice(data as ChatCompletion)

        if (s) {
            this.messages.push({
                role: 'assistant',
                content: s,
            });
        }
        return s ? JSON.parse(s) : null;
    }
    clear() {
        this.messages.splice(1);
    }
    get history() {
        return this.messages;
    }
}