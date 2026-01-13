'use client';

import { Item } from '@/types/quiz';
import { groupItemsByFlag } from '@/lib/quiz/helpers';

interface DragItemsDisplayProps {
  items: Item[];
  /**
   * Interactive 모드: 클릭 가능한 버튼
   * Display 모드: 읽기 전용 span
   */
  mode?: 'interactive' | 'display';
  /**
   * Interactive 모드에서만 사용
   * 아이템 클릭 시 호출되는 콜백
   */
  onItemClick?: (index: number) => void;
  /**
   * 커스텀 클래스
   */
  className?: string;
}

export default function DragItemsDisplay({
  items,
  mode = 'display',
  onItemClick,
  className = '',
}: DragItemsDisplayProps) {
  const groups = groupItemsByFlag(items);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {groups.map((group, groupIndex) => {
        const isSingleItem = group.length === 1;

        return (
          <div
            key={groupIndex}
            className="inline-flex bg-primaryColor/20 rounded-lg p-1 gap-1"
          >
            {isSingleItem ? (
              // 단일 아이템: 회색 박스 없이 텍스트만
              mode === 'interactive' ? (
                (() => {
                  const globalIndex = items.indexOf(group[0]);
                  const item = group[0];

                  return (
                    <button
                      onClick={() => onItemClick?.(globalIndex)}
                      className="px-2 py-1 text-sm transition-colors hover:bg-gray-100 cursor-pointer rounded"
                      title="클릭하여 아이템 병합/분리"
                    >
                      {item.content}
                    </button>
                  );
                })()
              ) : (
                <span className="px-2 py-1 text-sm">{group[0].content}</span>
              )
            ) : (
              // 여러 아이템: 각각 회색 박스로 표시
              group.map((item) => {
                const globalIndex = items.indexOf(item);

                return mode === 'interactive' ? (
                  <button
                    key={item.id}
                    onClick={() => onItemClick?.(globalIndex)}
                    className="px-2 py-1 bg-green-50 shadow-sm border border-green-200 rounded text-sm transition-colors hover:bg-green-100 cursor-pointer"
                    title="클릭하여 아이템 병합/분리"
                  >
                    {item.content}
                  </button>
                ) : (
                  <span
                    key={item.id}
                    className="px-2 py-1 bg-green-50 shadow-sm border border-green-200 rounded text-sm"
                  >
                    {item.content}
                  </span>
                );
              })
            )}
          </div>
        );
      })}
    </div>
  );
}
