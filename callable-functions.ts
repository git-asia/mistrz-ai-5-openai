import {ChatCompletionAssistantMessageParam} from "openai/resources/chat/completions";

enum CallableFunctions {
    AnswerSentiment = 'answerSentiment',
}

enum Sentiment {
    Positive = 'positive',
    Neutral = 'neutral',
    Negative = 'negative',
}

interface AnswerSentimentArgs {
    sentiment: Sentiment;
}

const answerSentiment = ({sentiment}: AnswerSentimentArgs) => {
    console.log('Sentiment is', sentiment);
    return 'Ok';
}

export const handleCalledFunction = (call: ChatCompletionAssistantMessageParam.FunctionCall): string => {
    try {
        switch (call.name as CallableFunctions) {
            case CallableFunctions.AnswerSentiment:
                return answerSentiment(JSON.parse(call.arguments));

            default:
                throw new Error('Unknown function name.');
        }

    } catch (err) {
        return  (err as Error).message;
    }
}