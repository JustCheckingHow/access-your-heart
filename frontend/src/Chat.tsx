import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { cn } from "./lib/utils";
import axios, { AxiosResponse } from "axios";
import Markdown from "react-markdown";

interface ChatProps {
  userData: {
    skills: string[];
    professions: string[];
  };
}

interface Message {
  role: "assistant" | "user";
  body: string;
}

const messages: Message[] = [
  {
    role: "assistant",
    body: "Cześć! Jestem tu aby pomóc Ci wybrać kierunek studiów. Zanim zaczniemy, chciałbym zadać Ci kilka pytań.",
  },
];

export function Chat({ userData }: ChatProps) {
  const [openChat, setOpenChat] = useState<boolean>(true);
  const [userMessage, setUserMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>(messages);
  const [fetchingMessage, setFetchingMessage] = useState<boolean>(false);

  const handleUserMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(event.target.value);
  };

  const askQuestion = async () => {
    setFetchingMessage(true);
    try {
      const response = await axios.post<
        { history: Message[]; user_data: ChatProps["userData"] },
        AxiosResponse<Message>
      >(
        `${import.meta.env.VITE_BACKEND_URL}/chat`,
        {
          history: [...chatHistory, { role: "user", body: userMessage }],
          user_data: userData,
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
      setChatHistory((prev) => [
        ...prev,
        { role: "user", body: userMessage },
        { role: "assistant", body: data.body },
      ]);
      setUserMessage("");
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingMessage(false);
    }
  };

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
              <p className="text-sm">
                <Markdown>{message.body}</Markdown>
              </p>
            </div>
          </div>
        ))}
        {fetchingMessage && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <circle cx="4" cy="12" r="3" fill="#888888">
              <animate
                id="svgSpinners3DotsFade0"
                fill="freeze"
                attributeName="opacity"
                begin="0;svgSpinners3DotsFade1.end-0.25s"
                dur="0.75s"
                values="1;.2"
              ></animate>
            </circle>
            <circle cx="12" cy="12" r="3" fill="#888888" opacity=".4">
              <animate
                fill="freeze"
                attributeName="opacity"
                begin="svgSpinners3DotsFade0.begin+0.15s"
                dur="0.75s"
                values="1;.2"
              ></animate>
            </circle>
            <circle cx="20" cy="12" r="3" fill="#888888" opacity=".3">
              <animate
                id="svgSpinners3DotsFade1"
                fill="freeze"
                attributeName="opacity"
                begin="svgSpinners3DotsFade0.begin+0.3s"
                dur="0.75s"
                values="1;.2"
              ></animate>
            </circle>
          </svg>
        )}
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
