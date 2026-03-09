import { api } from "../config/axios";

export interface ChatRequest {
  mensaje: string;
  usuario_id?: number; // opcional, por defecto 1
  conversation_id?: number | null; // opcional, puede ir vacío
  tipo_usuario: string; // aunque FastAPI no lo usa, puedes enviar extra
  incluir_contexto: boolean; // aunque FastAPI no lo usa, puedes enviar extra
}

export interface ChatResponse {
  conversation_id: number;
  question: string;
  response: {
    prompt?: string;
    response: string;
  };
  nlp: {
    keywords: Array<[string, number]>;
    entities: unknown[];
  };
}

export const chatService = {
  enviarMensaje: async (payload: ChatRequest): Promise<ChatResponse> => {
    const { data } = await api.post<ChatResponse>("/chat", {
      message: payload.mensaje,
      user_id: payload.usuario_id ?? 1,
      conversation_id: payload.conversation_id ?? null,
    });
    return data;
  },
};
