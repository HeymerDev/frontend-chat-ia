import { Chat } from "./components/Chat";
import { Header } from "./components/Header";

export const App = () => {
  return (
    <main className="min-h-screen bg-gray-100 grid">
      <Header />
      {/* Puedes cambiar el ID del usuario según sea necesario */}
      <div className="px-32 py-7">
        <Chat />
      </div>
    </main>
  );
};
