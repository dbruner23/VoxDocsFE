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
