export const cleanAIResponse = (text: string): string => {
  return text
    .replace(/<\/?[A-Z]+>/g, "") // Elimina cualquier tag como </ASSISTANT>, <REQUEST>, etc.
    .replace(/<\/?[a-z]+>/g, "") // Por si vienen en minúsculas
    .replace(/\s+/g, " ") // Quita espacios extras o saltos de línea repetidos
    .trim();
};
