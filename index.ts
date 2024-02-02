import {OpenAiChat} from "./open-ai-chat";
import {handleCalledFunction} from "./callable-functions";

(async () => {
    const chat = new OpenAiChat('Jesteś świetnym klasyfikatorem tekstów. Zwracasz odpowiedzi w formacie json wywołując funkcje.');

    const ans = await chat.say('Zwróć analizę tego tekstu:\n\n"Nigdy nie nauczę się języka hiszpańskiego."');

    console.log(ans)

    if (ans.functionCall) {
        const res = handleCalledFunction(ans.functionCall);
        await chat.say(res, 'function', ans.functionCall.name);
    }

})();




