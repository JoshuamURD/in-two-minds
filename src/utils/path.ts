export function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/\.md$/, "");
}

export function cleanWikiLink(str: string) {
  return str.replace(/\[\[|\]\]/g, "");
}
