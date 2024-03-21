export const highlightText = (text: string, highlight: string) => {
  if (!highlight) return text;

  const regex = new RegExp(highlight, "gi");
  return text.replace(
    regex,
    (match) => `<span class="highlight">${match}</span>`
  );
};
