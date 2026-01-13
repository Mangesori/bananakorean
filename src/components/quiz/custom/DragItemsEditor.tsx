'use client';

import { Item } from '@/types/quiz';
import { PARTICLES } from '@/lib/korean/particles';
import DragItemsDisplay from './DragItemsDisplay';

interface DragItemsEditorProps {
  answerText: string;
  items: Item[];
  onChange: (items: Item[]) => void;
}

export default function DragItemsEditor({
  answerText,
  items,
  onChange,
}: DragItemsEditorProps) {
  // Handle item click for smart Merge/Split
  const handleItemClick = (index: number) => {
    const updated = [...items];
    const currentItem = updated[index];

    // 1. Try to SPLIT (if it looks like [Word + Particle])
    // Check if the current content ends with any known particle
    const matchedParticle = PARTICLES.find(
      (p) =>
        currentItem.content.endsWith(p) &&
        currentItem.content.length > p.length
    );

    if (matchedParticle) {
      // Logic to Split: "저는" -> "저" + "는"
      const stem = currentItem.content.slice(
        0,
        currentItem.content.length - matchedParticle.length
      );
      
      // Update current item to be the stem
      updated[index] = {
        ...currentItem,
        content: stem,
        combineWithNext: true, // Auto-combine because they were attached
      };

      // Insert the particle as a new item
      const newParticleItem: Item = {
        id: `${currentItem.id}-split-${Date.now()}`, // Temporary unique ID
        content: matchedParticle,
        combineWithNext: false,
        originalWordIndex: currentItem.originalWordIndex,
      };

      updated.splice(index + 1, 0, newParticleItem);
      onChange(updated);
      return;
    }

    // 2. If it couldn't be split, try to MERGE with next item
    const nextItem = updated[index + 1];
    if (nextItem) {
      // Safety: Only merge if they belong to the same original word (or if index is missing)
      if (
        currentItem.originalWordIndex !== undefined &&
        nextItem.originalWordIndex !== undefined &&
        currentItem.originalWordIndex !== nextItem.originalWordIndex
      ) {
        return; // Different words -> block merge
      }

      // Merge current + next: "저" + "는" -> "저는"
      updated[index] = {
        ...currentItem,
        content: currentItem.content + nextItem.content,
        // Inherit the next item's combine status or keep default? 
        // Usually the tail determines the spacing, but merged item is now one chunk.
        combineWithNext: nextItem.combineWithNext, 
        // originalWordIndex: keep current's or mixed? 
        // If we merge, they become one.
      };

      // Remove the next item
      updated.splice(index + 1, 1);
      onChange(updated);
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
        💡 박스를 클릭하여 다음 아이템과 그룹화/분리를 토글할 수 있습니다
        <br />
        <span className="text-gray-500">
          Primary 배경색: 그룹 표시 | 회색 박스: 개별 아이템
        </span>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="text-xs text-gray-500 mb-2 font-medium">미리보기:</div>
        {items.length > 0 ? (
          <DragItemsDisplay
            items={items}
            mode="interactive"
            onItemClick={handleItemClick}
          />
        ) : (
          <p className="text-sm text-gray-400">
            답변을 입력하면 드래그 아이템이 표시됩니다
          </p>
        )}
      </div>
    </div>
  );
}
