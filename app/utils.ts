export function createExcerpt({ text, length = 150 }: { text: string; length?: number }): string {
  // Strip markdown syntax before creating a readable excerpt.
  const plain = text
    .replace(/```[\s\S]*?```/g, ' ') // code blocks
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/\n+/g, ' ') // newlines
    .replace(/^#{1,6}\s+/gm, '') // headings
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ') // images
    .replace(/\[[^\]]*\]\([^)]+\)/g, '$1') // links
    .replace(/[*_~>#]/g, '') // emphasis & blockquotes
    .replace(/\s{2,}/g, ' ')
    .trim();

  const excerpt = plain.slice(0, length).trim();

  return excerpt.length < plain.length ? `${excerpt}...` : excerpt;
}

interface ContentContext {
  keys: () => string[];
}

interface ContentEntry {
  title: string;
  content: string;
  featuredImage?: string;
  publishedAt?: string;
  tags?: string[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function dateKey(value: string): number {
  // Create a sortable epoch-like key from day-js "20th Jul 2026" style dates.
  const match = value.trim().match(/(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)\s+(\d{4})/i);
  if (!match) {
    return 0;
  }

  const day = parseInt(match[1], 10);
  const monthIndex = MONTHS.findIndex((m) => m.toLowerCase() === match[2].toLowerCase());
  const year = parseInt(match[3], 10);

  if (monthIndex === -1 || Number.isNaN(day) || Number.isNaN(year)) {
    return 0;
  }

  return year * 10000 + (monthIndex + 1) * 100 + day;
}

export interface ContentItem {
  slug: string;
  title: string;
  featuredImage?: string;
  excerpt?: string;
  publishedAt?: string;
  tags?: string[];
}

export async function getContent({
  context,
  prefix,
}: {
  context: ContentContext;
  prefix: string;
}): Promise<ContentItem[]> {
  const keys: string[] = context.keys();
  const slugs: string[] = [];

  // Get slugs
  for (let index = 0; index < keys.length; index += 1) {
    const slug = keys[index].replace(/^.\/|\.json$/g, '');
    slugs.push(slug);
  }

  // Get content
  const content: ContentItem[] = [];
  for (let index = 0; index < slugs.length; index += 1) {
    const slug = slugs[index];

    const entry = require(`@/content/${prefix}/${slug}.json`) as ContentEntry;

    content.push({
      slug,
      title: entry.title,
      ...(prefix === 'blog' && {
        excerpt: createExcerpt({ text: entry.content }),
      }),
      ...(prefix === 'blog' && entry.publishedAt && { publishedAt: entry.publishedAt }),
      ...(prefix === 'blog' && entry.tags && { tags: entry.tags }),
      featuredImage: entry.featuredImage,
    });
  }

  if (prefix === 'blog') {
    // Newest first.
    content.sort((a, b) => dateKey(b.publishedAt || '') - dateKey(a.publishedAt || ''));
  }

  return content;
}

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';

export function formatDate(value: string): string {
  const match = value.trim().match(/(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)\s+(\d{4})/i);
  if (!match) {
    return value;
  }

  const day = parseInt(match[1], 10);
  const month = match[2];
  const year = parseInt(match[3], 10);

  const bnDigits = (n: number): string =>
    String(n).replace(/\d/g, (d) => BN_DIGITS[parseInt(d, 10)]);

  const bnMonths: Record<string, string> = {
    Jan: 'জানুয়ারি',
    Feb: 'ফেব্রুয়ারি',
    Mar: 'মার্চ',
    Apr: 'এপ্রিল',
    May: 'মে',
    Jun: 'জুন',
    Jul: 'জুলাই',
    Aug: 'আগস্ট',
    Sep: 'সেপ্টেম্বর',
    Oct: 'অক্টোবর',
    Nov: 'নভেম্বর',
    Dec: 'ডিসেম্বর',
  };

  const monthBn = bnMonths[month] || month;

  return `${bnDigits(day)} ${monthBn}, ${bnDigits(year)}`;
}
