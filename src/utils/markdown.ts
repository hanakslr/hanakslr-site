const TRUNCATE_LENGTH = 500;

// Matches a full markdown link [text](url) or any single character
const LINK_RE = /\[([^\]]*)\]\([^)]*\)|[\s\S]/g;

export const truncateMarkdown = (text: string, maxLength = TRUNCATE_LENGTH): string => {
  let visualLen = 0;
  let i = 0;

  LINK_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while (visualLen < maxLength && (match = LINK_RE.exec(text)) !== null) {
    visualLen += match[1] !== undefined ? match[1].length : 1;
    i = LINK_RE.lastIndex;
  }

  if (i >= text.length) return text;

  // If we stopped mid-bare-URL, extend to URL end
  const slice = text.slice(0, i);
  if (/https?:\/\/\S*$/.test(slice)) {
    const urlEnd = text.slice(i).search(/\s/);
    return text.slice(0, i + (urlEnd === -1 ? text.length - i : urlEnd)) + "…";
  }

  return slice + "…";
};
