import { api } from "../config/axios";

export interface Conversation {
  id: number;
  user_id: number;
  start_time: string;
  end_time: string | null;
  title: string;
}

export interface ConversationMessage {
  message_id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface FullConversation {
  conversation_id: number;
  messages: ConversationMessage[];
}

export const conversationService = {
  obtenerConversaciones: async (): Promise<Conversation[]> => {
    const { data } = await api.get<Conversation[]>("/search/conversations");
    return data;
  },

  obtenerMensajes: async (
    conversationId: number,
  ): Promise<FullConversation> => {
    const { data } = await api.get<FullConversation>(
      `search/conversation/${conversationId}`,
    );
    return data;
  },

  descargarReporte: (conversationId: number) => {
    const url = `${api.defaults.baseURL}/report/${conversationId}`;

    const link = document.createElement("a");
    link.href = url;
    link.download = `conversation_${conversationId}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  buscarPorUsuario: async (userId: number): Promise<Conversation[]> => {
    const { data } = await api.get<Conversation[]>(`/search/user/${userId}`);
    return data;
  },

  buscarPorFecha: async (
    startDate: string,
    endDate: string,
  ): Promise<Conversation[]> => {
    const { data } = await api.get<Conversation[]>(
      `/search/date?start_date=${startDate}&end_date=${endDate}`,
    );
    return data;
  },

  buscarPorKeyword: async (word: string): Promise<Conversation[]> => {
    const { data } = await api.get<Conversation[]>(`/search/keyword/${word}`);
    return data;
  },
};
