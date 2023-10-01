import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { cn } from "./lib/utils";
import axios, { AxiosResponse } from "axios";

interface Message {
  role: "assistant" | "user";
  body: string;
}

const messages: Message[] = [
  { role: "assistant", body: "Cześć, jak mogę Ci pomóc?" },
];

export function Chat() {
  const [openChat, setOpenChat] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>(messages);

  const handleUserMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(event.target.value);
  };

  async function askQuestion() {
    try {
      const response = await axios.post<
        { history: Message[] },
        AxiosResponse<Message>
      >(
        `${import.meta.env.VITE_BACKEND_URL}/chat`,
        {
          history: [...chatHistory, { role: "user", body: userMessage }],
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            "Access-Control-Allow-Headers":
              "Origin, X-Requested-With, Content-Type, Accept",
          },
        }
      );
      console.log(response);
      const { data } = response;
      setChatHistory([
        ...chatHistory,
        { role: "user", body: userMessage },
        { role: "assistant", body: data.body },
      ]);
      setUserMessage("");
    } catch (error) {
      console.log(error);
    }
  }

  const button = (
    <div className="grid w-full max-w-xl items-center gap-4 mt-6 mx-auto">
      <Button variant="outline" onClick={() => setOpenChat(true)}>
        Zapytaj mnie
      </Button>
    </div>
  );
  if (!openChat) return button;
  return (
    <div className="grid w-full max-w-xl items-center gap-4 mt-6 mx-auto">
      <div className="flex flex-col w-full max-h-96 overflow-y-auto">
        {chatHistory.map((message) => (
          <div
            key={message.body}
            className={cn(
              "flex items-center space-x-4",
              message.role === "assistant" ? "justify-start" : "justify-end"
            )}
          >
            <div
              className={cn(
                "flex flex-col justify-center p-0 gap-1 px-2 py-1 rounded-lg my-2",
                message.role === "assistant"
                  ? "bg-blue-100 text-blue-500"
                  : "bg-green-100 text-green-500"
              )}
            >
              <h6 className="text-xs font-medium">
                {message.role === "assistant" ? "Asystent" : "Ty"}
              </h6>
              <p className="text-sm">{message.body}</p>
            </div>
          </div>
        ))}
      </div>
      <Input
        placeholder="Zapytaj mnie"
        onChange={handleUserMessage}
        value={userMessage}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            askQuestion();
          }
        }}
      />
      <div className="grid w-full max-w-xl items-center gap-4 mt-6 mx-auto">
        <Button variant="outline" onClick={() => setOpenChat(false)}>
          Schowaj mnie
        </Button>
      </div>
    </div>
  );
}
