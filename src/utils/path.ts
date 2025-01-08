export function slugify(str: string) {
  if (!str) return "";
  return str.toLowerCase().replace(/\s+/g, "-").replace(/\.md$/, "");
}

export function cleanWikiLink(str: string) {
  return str.replace(/\[\[|\]\]/g, "");
}

export function cleanMarkdownLink(str: string) {
  // Handle standard markdown links [text](link)
  const markdownMatch = str.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (markdownMatch) return markdownMatch[1];

  // If no markdown link found, return the original string
  return str;
}
