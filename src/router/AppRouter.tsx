import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Chat } from "../components/Chat";
import { Header } from "../components/Header";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Header />

      <main className="min-h-screen bg-gray-100">
        <div className="px-32 py-7">
          <Routes>
            <Route path="/" element={<Navigate to="/chat" />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:conversationId" element={<Chat />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
};
