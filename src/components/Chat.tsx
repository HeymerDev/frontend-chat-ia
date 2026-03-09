import { useRef, useState, useEffect } from "react";
import { UserMessage } from "./UserMessage";
import { chatService } from "../api/chat";
import { conversationService, type Conversation } from "../api/conversations";
import { ResponseLoading } from "./ResponseLoading";
import { cleanAIResponse } from "../utils";

interface Message {
  sender: "user" | "assistant";
  text: string;
}

export const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "assistant",
      text: "¡Hola! Soy tu asistente CUL. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<number | null>(null);

  const conversationIdRef = useRef<number | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cargar conversaciones previas al iniciar
    const cargarConversaciones = async () => {
      try {
        const data = await conversationService.obtenerConversaciones();
        setChats(data);
        if (data.length > 0) {
          selectChat(data[0].id);
        }
      } catch (error) {
        console.error("Error cargando conversaciones:", error);
      }
    };

    cargarConversaciones();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const newMessages: Message[] = [
      ...messages,
      { sender: "user", text: userText },
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const data = await chatService.enviarMensaje({
        mensaje: userText,
        usuario_id: 1,
        conversation_id: conversationIdRef.current,
        tipo_usuario: "estudiante",
        incluir_contexto: true,
      });

      // Guardamos el conversation_id devuelto
      conversationIdRef.current = data.conversation_id;
      setActiveChat(data.conversation_id);

      const botText = cleanAIResponse(data.response.response);
      setMessages([...newMessages, { sender: "assistant", text: botText }]);
      scrollToBottom();
    } catch (error) {
      console.error("Error comunicándose con la IA:", error);
      setMessages([
        ...newMessages,
        {
          sender: "assistant",
          text: "Error de conexión. Verifica que el servidor de IA esté corriendo.",
        },
      ]);
      scrollToBottom();
    } finally {
      setIsLoading(false);
    }
  };

  const selectChat = (id: number) => {
    setActiveChat(id);
    conversationIdRef.current = id;
    // Aquí puedes cargar los mensajes de esa conversación si tu API tiene endpoint
    setMessages([
      {
        sender: "assistant",
        text: "Conversación seleccionada. Continua escribiendo...",
      },
    ]);
  };

  const createNewChat = () => {
    setMessages([
      {
        sender: "assistant",
        text: "¡Hola! Soy tu asistente CUL. ¿En qué puedo ayudarte hoy?",
      },
    ]);
    conversationIdRef.current = undefined;
    setActiveChat(null);
  };

  return (
    <div className="flex h-[90vh] w-full mx-auto mt-5 border rounded-xl overflow-hidden shadow-lg">
      {/* SIDEBAR */}
      <div className="w-48 bg-gray-900 text-white flex flex-col">
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
              className={`p-2 rounded cursor-pointer mb-1 ${chat.id === activeChat ? "bg-gray-700" : "hover:bg-gray-800"}`}
            >
              <div className="flex justify-between items-center">
                <span className="truncate">{chat.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT */}
      <div className="flex flex-col flex-1 bg-white">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <UserMessage key={idx} sender={msg.sender} text={msg.text} />
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
            className="flex-1 border rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition-all disabled:bg-gray-100 placeholder:text-gray-400 text-lg"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Enviar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
