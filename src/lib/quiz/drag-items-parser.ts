import { Item } from '@/types/quiz';

/**
 * Parses a space-separated answer string into Item array
 * All items start with combineWithNext: false
 */
export function parseSpaceBasedInput(input: string): Item[] {
  const words = input.split(/\s+/).filter((w) => w.length > 0);

  return words.map((word, index) => ({
    id: String(index + 1),
    content: word,
    combineWithNext: false, // All items start independent
  }));
}

/**
 * Reconstructs the input string from Item array
 * Respects combineWithNext flag for spacing
 */
export function reconstructInputFromItems(items: Item[]): string {
  let result = '';

  for (let i = 0; i < items.length; i++) {
    result += items[i].content;

    // Add space if not combining with next and not the last item
    if (i < items.length - 1 && !items[i].combineWithNext) {
      result += ' ';
    }
  }

  return result;
}

/**
 * Validates that items reconstruct to match the expected answer
 */
export function validateItemsMatchAnswer(
  items: Item[],
  answer: string
): boolean {
  const reconstructed = reconstructInputFromItems(items);
  return reconstructed.trim() === answer.trim();
}

/**
 * Rebuilds item IDs sequentially (useful after modifications)
 */
export function rebuildItemIds(items: Item[]): Item[] {
  return items.map((item, index) => ({
    ...item,
    id: String(index + 1),
  }));
}
