interface Props {
  sender: "user" | "assistant";
  text: string;
}

export const UserMessage = ({ sender, text }: Props) => {
  return (
    <div
      className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-xs p-3 rounded-lg ${
          sender === "user" ? "bg-blue-600 text-white" : "bg-gray-300"
        }`}
      >
        <div>{text}</div>
      </div>
    </div>
  );
};
