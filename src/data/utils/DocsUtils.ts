export const getFileTypeFromExtension = (
  file: File
): "csv" | "pdf" | "html" | "markdown" | null => {
  const filename = file.name;
  const extension = filename
    .substring(filename.lastIndexOf(".") + 1)
    .toLowerCase();

  const mappings: { [key: string]: "csv" | "pdf" | "html" | "markdown" } = {
    csv: "csv",
    pdf: "pdf",
    html: "html",
    md: "markdown",
  };

  return mappings[extension] || null; // Return null if no mapping exists
};

export const cleanText = (text: string) => {
  // Replace invalid Unicode characters with empty string
  text = text.replace(
    /[\u0000-\u001F\u007F-\u009F\uD800-\uDFFF\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
    ""
  );

  // Replace smart quotes and other special characters
  const replacements: { [key: string]: string } = {
    "\u2018": "'", // Left single quotation mark
    "\u2019": "'", // Right single quotation mark
    "\u201C": '"', // Left double quotation mark
    "\u201D": '"', // Right double quotation mark
    "\u2026": "...", // Horizontal ellipsis
    "\u2013": "-", // En dash
    "\u2014": "--", // Em dash
  };

  text = text.replace(
    /[\u2018\u2019\u201C\u201D\u2026\u2013\u2014]/g,
    (match) => replacements[match] || match
  );

  // Replace remaining Unicode characters with ASCII equivalents
  text = text.normalize("NFD").replace(/[\u0300-\u036F]/g, "");

  return text;
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};

export const normalizeText = (text: string): string => {
  return text
    .replace(/”/g, '"') // Normalize curly double quotes to straight quotes
    .replace(/‘/g, "'") // Normalize curly single quotes to straight quotes
    .replace(/–|—/g, "-") // Normalize en and em dashes to hyphens
    .replace(/\s+/g, " ") // Replace multiple whitespace characters with a single space
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
};
