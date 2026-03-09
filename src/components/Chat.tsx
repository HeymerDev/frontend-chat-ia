import { useRef, useState, useEffect } from "react";
import { UserMessage } from "./UserMessage";
import { chatService } from "../api/chat";
import { ResponseLoading } from "./ResponseLoading";
import { cleanAIResponse } from "../utils";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatSession {
  id: number;
  title: string;
  messages: Message[];
}

export const Chat = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChat, setActiveChat] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const defaultMessage: Message = {
    sender: "bot",
    text: "¡Hola! Soy tu asistente CUL. ¿En qué puedo ayudarte hoy?",
  };

  useEffect(() => {
    const saved = localStorage.getItem("ai_chats");

    if (saved) {
      const parsed = JSON.parse(saved);
      setChats(parsed);

      if (parsed.length > 0) {
        setActiveChat(parsed[0].id);
        setMessages(parsed[0].messages);
      }
    } else {
      createNewChat();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const saveChats = (updated: ChatSession[]) => {
    setChats(updated);
    localStorage.setItem("ai_chats", JSON.stringify(updated));
  };

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now(),
      title: "Nuevo chat",
      messages: [defaultMessage],
    };

    const updated = [newChat, ...chats];

    saveChats(updated);
    setActiveChat(newChat.id);
    setMessages(newChat.messages);
  };

  const selectChat = (id: number) => {
    const chat = chats.find((c) => c.id === id);
    if (!chat) return;

    setActiveChat(id);
    setMessages(chat.messages);
  };

  const renameChat = (id: number) => {
    const title = prompt("Nuevo nombre del chat");

    if (!title) return;

    const updated = chats.map((chat) =>
      chat.id === id ? { ...chat, title } : chat,
    );

    saveChats(updated);
  };

  const updateChatMessages = (newMessages: Message[]) => {
    const updated = chats.map((chat) =>
      chat.id === activeChat ? { ...chat, messages: newMessages } : chat,
    );

    saveChats(updated);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();

    const updatedMessages = [
      ...messages,
      { sender: "user" as const, text: userText },
    ];

    setMessages(updatedMessages);
    updateChatMessages(updatedMessages);

    setInput("");
    setIsLoading(true);

    try {
      const data = await chatService.enviarMensaje({
        mensaje: userText,
        usuario_id: 1,
        tipo_usuario: "estudiante",
        incluir_contexto: true,
      });

      const cleanText = cleanAIResponse(data.respuesta);

      const finalMessages = [
        ...updatedMessages,
        { sender: "bot" as const, text: cleanText },
      ];

      setMessages(finalMessages);
      updateChatMessages(finalMessages);
    } catch (error) {
      console.error("Error en la comunicación con la IA:", error);

      const finalMessages = [
        ...updatedMessages,
        {
          sender: "bot" as const,
          text: "Error de conexión. Verifica que el servidor de IA esté corriendo.",
        },
      ];

      setMessages(finalMessages);
      updateChatMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[85vh] max-w-7xl mx-auto mt-5 border rounded-xl overflow-hidden shadow-lg">
      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <button
          onClick={createNewChat}
          className="m-3 p-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          + Nuevo chat
        </button>

        <div className="flex-1 overflow-y-auto px-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => selectChat(chat.id)}
              className={`p-2 rounded cursor-pointer mb-1 ${
                chat.id === activeChat ? "bg-gray-700" : "hover:bg-gray-800"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="truncate">{chat.title}</span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    renameChat(chat.id);
                  }}
                  className="text-xs opacity-60 hover:opacity-100"
                >
                  ✏️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT */}
      <div className="flex flex-col flex-1 bg-white">
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
          {messages.map((msg, index) => (
            <UserMessage key={index} sender={msg.sender} text={msg.text} />
          ))}

          {isLoading && <ResponseLoading />}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t flex gap-2 bg-white">
          <input
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={
              isLoading
                ? "Procesando respuesta..."
                : "Escribe tu consulta académica..."
            }
            className="flex-1 border rounded-lg px-4 py-2 outline-none focus:border-blue-500 transition-all disabled:bg-gray-100 placeholder:text-gray-400"
          />

          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </span>
            ) : (
              "Enviar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
