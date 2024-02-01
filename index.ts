import {OpenAiChat} from "./open-ai-chat";

(async () => {
    const chat = new OpenAiChat('Jesteś świetnym klasyfikatorem tekstów. Zwracasz odpowiedzi w formacie json.');

    console.log(await chat.say('Zwróć sentyment tego tekstu jako `sentiment`:\n\n"Nigdy nie nauczę się języka hiszpańskiego."'));
    console.log(await chat.say('Zwróć temat tego tekstu jako `topic`'));
    console.log(await chat.say('Zwróć słowo kluczowe tego tekstu jako `keyword`'));

    console.log(chat.history);
})();




