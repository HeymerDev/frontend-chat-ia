import { Chat } from "./components/Chat";
import { Header } from "./components/Header";

export const App = () => {
  return (
    <main className="min-h-screen bg-gray-100 grid">
      <Header />
      <Chat />
    </main>
  );
};
