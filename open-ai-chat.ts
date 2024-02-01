import OpenAI from "openai";
import {ChatCompletionCreateParamsBase} from "openai/resources/chat/completions";
import {Chat} from "openai/resources";
import ChatCompletion = Chat.ChatCompletion;
import { OPENAI_API_KEY } from "./config";

const parameters: ChatCompletionCreateParamsBase = {
    n: 1,
    top_p: 1,
    temperature: 1,
    max_tokens: 1000,
    stream: false,
    model: 'gpt-4-1106-preview',
    messages: [],
    response_format: { type: 'json_object' },
}


const extractFirstChoiceText = (msg: OpenAI.Chat.Completions.ChatCompletion): string | null => {
    return msg?.choices?.[0]?.message?.content ?? null;
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
    async say(prompt: string): Promise<any | null> {
        this.messages.push({
            role: 'user',
            content: prompt,
        });

        const data = await this.openai.chat.completions.create({
            ...parameters,
            messages: this.messages,
        })

        const s = extractFirstChoiceText(data as ChatCompletion)

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