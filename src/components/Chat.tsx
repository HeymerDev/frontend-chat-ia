import { useRef, useState, useEffect } from "react";
import { UserMessage } from "./UserMessage";
import { chatService } from "../api/chat";
import { ResponseLoading } from "./ResponseLoading";
import { cleanAIResponse } from "../utils";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export const Chat = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "¡Hola! Soy tu asistente CUL. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
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

      setMessages((prev) => [...prev, { sender: "bot", text: cleanText }]);
    } catch (error) {
      console.error("Error en la comunicación con la IA:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Error de conexión. Verifica que el servidor de IA esté corriendo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-5xl mx-auto w-full mt-5 rounded-xl bg-white shadow-lg overflow-hidden border border-gray-200">
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
  );
};
