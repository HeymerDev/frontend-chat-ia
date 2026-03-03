import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ChatRequest {
  mensaje: string;
  usuario_id: number;
  tipo_usuario: string;
  incluir_contexto: boolean;
}

export interface ChatResponse {
  respuesta: string;
  intencion: string;
  contexto_usado: unknown;
}

export const chatService = {
  enviarMensaje: async (payload: ChatRequest): Promise<ChatResponse> => {
    const { data } = await api.post<ChatResponse>("/chat/", payload);
    return data;
  },
};
