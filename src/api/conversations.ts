import { api } from "../config/axios";

export interface Conversation {
  id: number;
  user_id: number;
  start_time: string;
  end_time: string | null;
  title: string;
}

export const conversationService = {
  obtenerConversaciones: async (): Promise<Conversation[]> => {
    const { data } = await api.get<Conversation[]>("/search/conversations");
    return data;
  },
};
