export function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-");
}

export function cleanWikiLink(str: string) {
  return str.replace(/\[\[|\]\]/g, "");
}
