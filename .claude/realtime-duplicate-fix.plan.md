# 실시간 메시지 중복 추가 문제 해결

## 현재 상황 (업데이트)

✅ **작동하는 것**:
- Realtime 구독 성공
- 메시지 이벤트 수신
- Strict Mode 비활성화 완료
- useRef 중복 체크 구현 완료

❌ **문제 (Strict Mode 비활성화 후에도 발생)**:
- React 경고: `Encountered two children with the same key`
- 메시지가 UI에 두 번 표시됨
- **BUT**: 콜백은 한 번만 호출됨 (로그 확인)
- **BUT**: `[Realtime] Already processed message` 로그 없음 = 중복 수신 아님!

## 새로운 원인 분석

**Hot Reload/Fast Refresh로 인한 중복 구독 문제**:

로그 분석:
```
[Fast Refresh] rebuilding
[Fast Refresh] done in 334ms
✅ Profile loaded (2번)
✅ Enriched user (2번)
[Realtime] New message received: ㄱㄱ (1번만)
[Realtime] ✅ Adding new message to UI: ㄱㄱ (1번만)
Warning: Encountered two children with the same key
```

**결론**: 
- 콜백은 1번만 호출됨
- 하지만 messages 배열에 중복 ID 존재
- Hot Reload 시 컴포넌트가 재마운트되면서:
  1. 기존 구독이 제대로 정리되지 않음
  2. 새 구독이 추가됨
  3. 같은 메시지에 대해 여러 구독에서 이벤트 발생
  4. **또는** 기존 messages 상태가 유지되면서 새로 fetch한 메시지와 중복

## 해결 방안

### useRef로 처리된 메시지 ID 추적

```javascript
const processedMessageIds = useRef(new Set());

// 콜백 내부에서
if (processedMessageIds.current.has(payload.new.id)) {
  return; // 이미 처리된 메시지
}
processedMessageIds.current.add(payload.new.id);
```

이 방법은:
- React 렌더링 주기와 무관하게 즉시 중복 체크
- Set 자료구조로 O(1) 성능
- 메모리 누수 방지를 위해 주기적으로 정리 가능

## 해결 방안

### 1. 구독 cleanup 강화
useEffect cleanup에서 processedMessageIds도 초기화

### 2. fetchMessages 후 기존 메시지 ID를 processedMessageIds에 추가
초기 로드된 메시지들이 Realtime으로 다시 들어오지 않도록

### 3. 디버깅 로그 추가
- messages 배열의 실제 ID 목록 출력
- 중복 ID 감지 로직 추가

