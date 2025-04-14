import { getCollection } from "astro:content";
import { cleanWikiLink } from "./path";

export async function getTopicGroups() {
  const allContent = await Promise.all([
    getCollection("books"),
    getCollection("essays"),
  ]);

  // Flatten all content
  const allItems = allContent.flat();

  // Create a map of topics with their counts
  const topicCounts = new Map();
  allItems.forEach((item) => {
    (item.data.topics || []).forEach((topic) => {
      topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
    });
  });

  // Group topics by first letter with their counts
  const groups = Array.from(topicCounts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((acc, [topic, count]) => {
      const letter = topic[0].toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push({ name: topic, count });
      return acc;
    }, {});

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

export interface TopicConnection {
  source: string;
  target: string;
}

export async function getTopicConnections(): Promise<TopicConnection[]> {
  const allEssays = await getCollection('essays');
  const allBooks = await getCollection('books');
  
  const connections: TopicConnection[] = [];
  
  // Analyze essays
  allEssays.forEach(essay => {
    const topics = essay.data.topics.map(topic => {
      const match = topic.match(/\[([^\]]+)\]\(([^)]+)\)/);
      return match ? match[1] : topic;
    });
    
    // Create connections between all topics in the same essay
    for (let i = 0; i < topics.length; i++) {
      for (let j = i + 1; j < topics.length; j++) {
        connections.push({
          source: cleanWikiLink(topics[i]),
          target: cleanWikiLink(topics[j])
        });
      }
    }
  });
  
  // Analyze books
  allBooks.forEach(book => {
    if (!book.data.topics) return;
    
    const topics = book.data.topics.map(topic => {
      const match = topic.match(/\[([^\]]+)\]\(([^)]+)\)/);
      return match ? match[1] : topic;
    });
    
    // Create connections between all topics in the same book
    for (let i = 0; i < topics.length; i++) {
      for (let j = i + 1; j < topics.length; j++) {
        connections.push({
          source: cleanWikiLink(topics[i]),
          target: cleanWikiLink(topics[j])
        });
      }
    }
  });
  
  return connections;
}
