import { randomUUID } from "crypto";
import { IncomingMessage } from "http";
import { Configuration, OpenAIApi } from "openai-edge";

export type ChatGPTAgent = "user" | "system";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface OpenAIRequestPayload {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function OpenAIRequest(payload: OpenAIRequestPayload) {
  const completion = await openai.createChatCompletion(payload);

  let decoder = new TextDecoder();
  let encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      function prepareChunk(chunk: Uint8Array) {
        let str = decoder.decode(chunk).trim();
        str = str.replace(/^data: /, "");
        if (str === "[DONE]") {
          str = "";
          controller.close();
          return;
        }

        try {
          let json = JSON.parse(str);
          let text = json.choices[0].delta?.content || "";
          controller.enqueue(encoder.encode(text));
        } catch (err) {
          console.error(err);
        }
      }

      let stream = completion.body!.getReader();
      while (true) {
        const { done, value } = await stream.read();
        if (done) {
          // Do something with last chunk of data then exit reader
          controller.close();
          return;
        }
        prepareChunk(value);
      }
    },
  });
}
