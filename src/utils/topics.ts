import { getCollection } from "astro:content";
import { cleanWikiLink } from "./path";

export async function getTopicGroups() {
  // Get all essays and books
  const [allEssays, allBooks] = await Promise.all([
    getCollection("essays"),
    getCollection("books"),
  ]);

  // Extract unique topics from both essays and books
  const topics = [
    ...new Set([
      ...allEssays.flatMap((essay) =>
        essay.data.topics.map((topic) => {
          const match = topic.match(/\[([^\]]+)\]\(([^)]+)\)/);
          return match ? match[1] : topic;
        })
      ),
      ...allBooks.flatMap(
        (book) =>
          book.data.topics?.map((topic) => {
            const match = topic.match(/\[([^\]]+)\]\(([^)]+)\)/);
            return match ? cleanWikiLink(match[1]) : cleanWikiLink(topic);
          }) || []
      ),
    ]),
  ].sort();

  // Group topics by first letter
  const groups = topics.reduce((acc, topic) => {
    const firstLetter = topic.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(topic);
    return acc;
  }, {} as Record<string, string[]>);

  // Sort topics within each group
  Object.keys(groups).forEach((key) => {
    groups[key].sort();
  });

  return groups;
}

// Add a function to get featured topics for the homepage
export async function getFeaturedTopics(limit = 6) {
  const [allEssays, allBooks] = await Promise.all([
    getCollection("essays"),
    getCollection("books"),
  ]);

  // Create a map to count topic occurrences
  const topicCounts = new Map<string, number>();

  // Count occurrences from essays
  allEssays.forEach((essay) => {
    essay.data.topics.forEach((topic) => {
      const cleanTopic = cleanWikiLink(
        topic.replace(/\[(.*?)\]\(.*?\)/g, "$1")
      );
      topicCounts.set(cleanTopic, (topicCounts.get(cleanTopic) || 0) + 1);
    });
  });

  // Count occurrences from books
  allBooks.forEach((book) => {
    book.data.topics?.forEach((topic) => {
      const cleanTopic = cleanWikiLink(
        topic.replace(/\[(.*?)\]\(.*?\)/g, "$1")
      );
      topicCounts.set(cleanTopic, (topicCounts.get(cleanTopic) || 0) + 1);
    });
  });

  // Sort by frequency and return top N topics
  return Array.from(topicCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([topic]) => topic);
}
