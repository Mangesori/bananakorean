# IcoFont → Lucide React 아이콘 매핑 테이블

## 메시지 관련 아이콘
| IcoFont 클래스 | Lucide 컴포넌트 | 설명 |
|----------------|-----------------|------|
| `icofont-attachment` | `Paperclip` | 파일 첨부 |
| `icofont-paper-plane` | `Send` | 메시지 전송 |
| `icofont-emoji-smile` | `Smile` | 이모지 |
| `icofont-spinner-alt-2` | `Loader2` | 로딩 스피너 |
| `icofont-speech-comments` | `MessageSquare` | 메시지/대화 |
| `icofont-chat` | `MessagesSquare` | 채팅 |
| `icofont-arrow-left` | `ArrowLeft` | 뒤로가기 |
| `icofont-simple-down` | `ChevronDown` | 드롭다운 |
| `icofont-search` | `Search` | 검색 |
| `icofont-close` | `X` | 닫기 |
| `icofont-close-line` | `X` | 닫기 |

## UI/네비게이션 아이콘
| IcoFont 클래스 | Lucide 컴포넌트 | 설명 |
|----------------|-----------------|------|
| `icofont-navigation-menu` | `Menu` | 모바일 메뉴 |
| `icofont-rounded-down` | `ChevronDown` | 아래 화살표 |
| `icofont-rounded-up` | `ChevronUp` | 위 화살표 |
| `icofont-simple-right` | `ChevronRight` | 오른쪽 화살표 |
| `icofont-long-arrow-right` | `ArrowRight` | 긴 오른쪽 화살표 |
| `icofont-double-left` | `ChevronsLeft` | 이중 왼쪽 화살표 |
| `icofont-double-right` | `ChevronsRight` | 이중 오른쪽 화살표 |
| `icofont-check` | `Check` | 체크 표시 |
| `icofont-check-alt` | `Check` | 체크 표시 |

## 소셜 미디어 아이콘
| IcoFont 클래스 | Lucide 컴포넌트 | 설명 |
|----------------|-----------------|------|
| `icofont-facebook` | `Facebook` | 페이스북 |
| `icofont-twitter` | `Twitter` | 트위터 |
| `icofont-instagram` | `Instagram` | 인스타그램 |
| `icofont-linkedin` | `Linkedin` | 링크드인 |
| `icofont-youtube-play` | `Youtube` | 유튜브 |
| `icofont-vimeo` | 직접 SVG 사용 | Vimeo (Lucide에 없음) |
| `icofont-skype` | 직접 SVG 사용 | Skype (Lucide에 없음) |

## 별점/평가 아이콘
| IcoFont 클래스 | Lucide 컴포넌트 | 설명 |
|----------------|-----------------|------|
| `icofont-star` | `Star` | 별 |
| `icofont-heart-alt` | `Heart` | 하트 |

## 시간/날짜 아이콘
| IcoFont 클래스 | Lucide 컴포넌트 | 설명 |
|----------------|-----------------|------|
| `icofont-clock-time` | `Clock` | 시계 |
| `icofont-calendar` | `Calendar` | 달력 |

## 교육/학습 아이콘
| IcoFont 클래스 | Lucide 컴포넌트 | 설명 |
|----------------|-----------------|------|
| `icofont-book-alt` | `Book` | 책 |
| `icofont-teacher` | `GraduationCap` | 선생님/졸업 |
| `icofont-learn` | `BookOpen` | 학습 |
| `icofont-certificate` | `Award` | 자격증/상 |
| `icofont-document-folder` | `Folder` | 문서 폴더 |

## 기타 아이콘
| IcoFont 클래스 | Lucide 컴포넌트 | 설명 |
|----------------|-----------------|------|
| `icofont-user-alt-5` | `User` | 사용자 |
| `icofont-search-1` | `Search` | 검색 |
| `icofont-search-2` | `Search` | 검색 |
| `icofont-share` | `Share2` | 공유 |
| `icofont-globe-alt` | `Globe` | 지구본/언어 |
| `icofont-business-man-alt-2` | `User` | 비즈니스 사용자 |
| `icofont-eraser-alt` | `Tag` | 태그/카테고리 |
| `icofont-quote-left` | `Quote` | 왼쪽 따옴표 |
| `icofont-quote-right` | `Quote` | 오른쪽 따옴표 |

## 사용 예시

### IcoFont (이전)
```jsx
<i className="icofont-attachment text-xl text-gray-600"></i>
```

### Lucide React (이후)
```jsx
import { Paperclip } from 'lucide-react'

<Paperclip size={20} className="text-gray-600" />
```

## 참고사항
- Lucide에 없는 아이콘 (Vimeo, Skype 등)은 직접 SVG를 사용하거나 다른 아이콘으로 대체
- 크기는 `size` prop으로 제어 (기본값: 24)
- 색상은 `className` 또는 `color` prop으로 제어
- strokeWidth로 선 굵기 조정 가능
