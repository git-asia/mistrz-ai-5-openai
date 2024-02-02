import {ChatCompletionAssistantMessageParam} from "openai/resources/chat/completions";

enum CallableFunctions {
    AnswerTextAnalysis = 'answerTextAnalysis',
}

enum Sentiment {
    Positive = 'positive',
    Neutral = 'neutral',
    Negative = 'negative',
}

interface AnswerTextAnalysisArgs {
    sentiment: Sentiment;
    subject: string;
    keyword: string;
}

const answerTextAnalysis = (data: AnswerTextAnalysisArgs) => {
    console.log('Text analysis result is', data);
    return 'Ok';
}

export const handleCalledFunction = (call: ChatCompletionAssistantMessageParam.FunctionCall): string => {
    try {
        switch (call.name as CallableFunctions) {
            case CallableFunctions.AnswerTextAnalysis:
                return answerTextAnalysis(JSON.parse(call.arguments));

            default:
                throw new Error('Unknown function name.');
        }

    } catch (err) {
        return  (err as Error).message;
    }
}