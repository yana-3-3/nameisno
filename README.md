# 코지 라이프 (Cozy Life)

심즈 + 스타듀밸리 느낌의 웹 기반 인생 시뮬레이션 게임. Firebase로 실시간 멀티플레이 기능을 제공합니다.

## 현재 구현된 기능

- ✅ 이메일/비밀번호 로그인 · 회원가입
- ✅ 캐릭터 스탯 (체력 / 배고픔 / 소지금) + 실시간 동기화
- ✅ 인벤토리 (16칸)
- ✅ 실시간 글로벌 채팅
- ✅ 온라인 접속 상태 표시
- ✅ 타일맵 기반 월드 이동 (집 · 밭 · 연못 · 카페 · 상점 · 광장)
- ✅ 기본 액션 (쉬기 · 채집 · 낚시 · 아르바이트)

## 프로젝트 구조

```
life-game/
├── index.html              # 마크업 + 레이아웃
├── css/
│   └── style.css           # 코지 테마 스타일
└── js/
    ├── main.js             # 엔트리포인트, 이벤트 연결
    ├── firebase-config.js  # Firebase 초기화 (⚠️ 본인 config 입력)
    ├── auth.js             # 로그인 / 회원가입 / 로그아웃
    ├── player.js           # 플레이어 상태 관리 (스탯 · 인벤토리)
    ├── world.js            # 장소 · 아이템 정의 (데이터)
    ├── ui.js               # DOM 렌더링 함수들
    └── chat.js             # 실시간 채팅 (Realtime DB)
```

## Firebase 설정하기 (필수)

### 1. Firebase 프로젝트 만들기
1. https://console.firebase.google.com 접속
2. "프로젝트 추가" → 이름 입력 (예: `cozy-life`)
3. Google Analytics는 꺼도 됨

### 2. 웹 앱 등록
1. 프로젝트 대시보드 → 웹(`</>`) 아이콘 클릭
2. 앱 닉네임 입력 → "앱 등록"
3. 나오는 `firebaseConfig` 객체를 복사

### 3. 코드에 config 넣기
`js/firebase-config.js` 파일을 열고 `firebaseConfig` 객체를 방금 복사한 걸로 교체.

### 4. Firebase 서비스 활성화
Firebase 콘솔 좌측 메뉴에서:

**Authentication**
- Authentication → 시작하기 → "이메일/비밀번호" 활성화

**Firestore Database**
- Firestore Database → 데이터베이스 만들기 → "테스트 모드로 시작" → 리전 선택 (asia-northeast3 추천)

**Realtime Database**
- Realtime Database → 데이터베이스 만들기 → 리전 선택 → "테스트 모드로 시작"

### 5. 보안 규칙 (중요!)
테스트 모드는 30일 후 막힙니다. 다음 규칙을 설정하세요.

**Firestore 규칙** (Firestore → 규칙):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /players/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

**Realtime Database 규칙** (Realtime Database → 규칙):
```json
{
  "rules": {
    "chat": {
      "global": {
        ".read": "auth != null",
        ".write": "auth != null",
        "$msgId": {
          ".validate": "newData.hasChildren(['uid', 'nickname', 'text', 'ts']) && newData.child('text').val().length <= 200"
        }
      }
    },
    "presence": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth.uid == $uid"
      }
    }
  }
}
```

## 실행하기

Firebase SDK는 ES 모듈(`import`)을 쓰기 때문에 `file://` 로 직접 열면 동작하지 않습니다. 로컬 서버가 필요해요.

**방법 A — Python (가장 간단)**
```bash
cd life-game
python3 -m http.server 8000
```
브라우저에서 `http://localhost:8000`

**방법 B — VS Code Live Server 확장 프로그램**
index.html 우클릭 → "Open with Live Server"

**방법 C — GitHub Pages 배포**
1. GitHub에 리포지토리 만들고 push
2. Settings → Pages → Source를 `main` 브랜치로 설정
3. `https://username.github.io/repo-name/` 에서 접속

## 확장 방법 (앞으로 할 일)

### 새 장소 추가
`js/world.js`의 `LOCATIONS` 객체에 항목 추가 + `LOCATION_ICONS`에 SVG path 추가.

### 새 아이템 추가
`js/world.js`의 `ITEMS`에 추가.

### 새 액션 (농사, 요리 등)
1. `world.js`에서 해당 장소의 `actions` 배열에 항목 추가
2. `main.js`의 `onAction()` switch 문에 case 추가

### 상점 시스템
- `world.js`의 `shop` 장소에 `actions` 추가하거나 모달 열기
- 아이템 가격은 `ITEMS.value` 사용
- `player.addMoney(-price)` + `player.addItem()` 조합

### 유저 간 거래
Firestore에 `trades` 컬렉션 만들고, 두 유저가 각각 승인하는 방식이 안전.
치팅 방지를 위해 나중에 Cloud Functions로 옮기기 권장.

### 시간 경과 시스템
접속할 때 `lastSeen`과 현재 시간 차이를 계산해서 작물이 자라게 하거나 배고픔이 감소하게.

## 앞으로 추가하면 좋을 것들
- 요리 시스템 (재료 → 완성된 음식)
- 상점 UI (모달)
- 유저 간 거래 (제안 → 수락/거절)
- 캐릭터 커스터마이징
- 친구/차단 기능
- 채팅 필터 (비속어)
- Cloud Functions로 서버 검증 (치팅 방지)
