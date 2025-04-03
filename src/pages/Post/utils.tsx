import React from "react";

// Utility type for header items
interface TOCItem {
  id: string;
  text: string;
  level: number;
}

// Function to create a slug from heading text
const slugify = (text: React.ReactNode): string => {
  // Convert React node to string
  const stringText = React.Children.toArray(text)
    .map((node) => {
      if (typeof node === "string") return node;
      if (typeof node === "number") return String(node);
      return "";
    })
    .join("");

  return stringText
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-"); // Replace multiple hyphens with single hyphen
};

// Function to extract headings from markdown content
export const extractHeadings = (markdown: string): TOCItem[] => {
  let inCodeBlock = false;
  const headingLines = markdown.split("\n").filter((line) => {
    // Skip code block markers and their content
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      return false;
    }
    if (inCodeBlock) return false;

    // Skip HTML content and non-heading lines
    if (line.trim().startsWith("<")) return false;
    if (!line.startsWith("#")) return false;
    if (line.startsWith("#@")) return false;
    return true;
  });
  return headingLines.map((line) => {
    // Count the number of # at the beginning to determine level
    const level = line.match(/^#+/)?.[0].length || 0;
    const text = line.replace(/^#+\s+/, "");
    // Create an ID based on the text content
    const id = slugify(text);
    return { id, text, level };
  });
};

/* These add ids for nav */
export const headingsComponents = {
  h1: ({ children, ...props }: any) => (
    <h1 id={slugify(children)} {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 id={slugify(children)} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 id={slugify(children)} {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: any) => (
    <h4 id={slugify(children)} {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: any) => (
    <h5 id={slugify(children)} {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }: any) => (
    <h6 id={slugify(children)} {...props}>
      {children}
    </h6>
  ),
};