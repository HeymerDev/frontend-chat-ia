export const ResponseLoading = () => {
  return (
    <div className="flex items-center gap-2 text-blue-600 animate-pulse font-medium">
      <span className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
      </span>
      Procesando con modelo local...
    </div>
  );
};
