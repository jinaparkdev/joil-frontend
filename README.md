# 인테리어 3D 에디터

블렌더로 제작한 3D 모델을 활용하는 인테리어 웹서비스입니다. 사용자가 가상의 공간을 만들고 가구를 배치할 수 있는 웹 애플리케이션입니다.

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **3D 렌더링**: Three.js, @react-three/fiber, @react-three/drei
- **상태 관리**: Zustand
- **스타일링**: Tailwind CSS
- **애니메이션**: Framer Motion

## 프로젝트 구조

```
src/
├── app/
│   ├── (3d-editor)/
│   │   └── page.tsx          # 메인 3D 에디터 페이지
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── 3d/
│   │   ├── Scene.tsx         # Three.js 씬 컴포넌트
│   │   ├── Room.tsx          # 방 컴포넌트
│   │   ├── Furniture.tsx     # 가구 컴포넌트
│   │   └── Camera.tsx        # 카메라 컨트롤
│   └── ui/
│       ├── Toolbar.tsx       # 도구바
│       ├── FurniturePanel.tsx # 가구 선택 패널
│       └── PropertiesPanel.tsx # 속성 패널
├── stores/
│   ├── sceneStore.ts         # 3D 씬 상태 관리
│   └── furnitureStore.ts     # 가구 상태 관리
├── types/
│   └── scene.ts             # 3D 관련 타입 정의
├── utils/
│   └── loaders.ts           # GLTF 로더 유틸
└── public/
    ├── models/              # 3D 모델 파일 저장소
    ├── thumbnails/          # 가구 썸네일 이미지
    └── draco/              # Draco 압축 라이브러리
```

## 주요 기능

### 1. 3D 씬 설정
- Three.js 기본 씬, 카메라, 조명 설정
- OrbitControls로 카메라 조작 (회전, 확대/축소, 패닝)
- 격자 바닥 표시 및 토글 기능

### 2. 기본 방 구조
- 간단한 박스 형태의 방 구조
- 벽, 바닥, 천장 구분
- 사용자 정의 가능한 방 크기

### 3. 가구 배치 시스템
- 클릭으로 가구 선택 및 배치
- 드래그로 가구 이동
- Transform controls (이동, 회전, 스케일)
- 격자 스냅 기능

### 4. UI 컴포넌트
- **도구바**: 선택, 이동, 회전, 크기 조정 모드
- **가구 패널**: 카테고리별 가구 목록 및 추가 기능
- **속성 패널**: 선택된 객체의 위치, 회전, 크기 편집
- **설정**: 격자 표시, 스냅 기능 토글

### 5. 상태 관리
- Zustand로 씬 상태 관리
- 가구 위치, 회전, 스케일 정보 저장
- 선택 상태 및 에디터 모드 관리

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인합니다.

### 3. 빌드

```bash
npm run build
```

## GLTF/GLB 모델 추가하기

### 1. 모델 파일 배치
- GLTF/GLB 파일을 `public/models/furniture/` 디렉토리에 배치
- 썸네일 이미지를 `public/thumbnails/` 디렉토리에 배치

### 2. 가구 카테고리에 추가
`src/stores/furnitureStore.ts`에서 `defaultCategories` 배열에 새 가구 템플릿을 추가:

```typescript
{
  id: 'new-furniture-id',
  name: '새 가구 이름',
  modelPath: '/models/furniture/your-model.glb',
  thumbnail: '/thumbnails/your-thumbnail.jpg',
  defaultScale: new Vector3(1, 1, 1),
  category: 'your-category'
}
```

### 3. Draco 압축 지원
- Draco 압축된 모델을 사용하는 경우
- 필요한 Draco 디코더 파일들을 `public/draco/` 디렉토리에 배치

## 사용 방법

1. **가구 추가**: 우측 가구 패널에서 원하는 가구를 클릭하여 씬에 추가
2. **가구 선택**: 씬에서 가구를 클릭하여 선택
3. **가구 편집**: 
   - 가구를 드래그하여 이동
   - 우측 하단 속성 패널에서 정확한 수치 입력
4. **카메라 조작**:
   - 마우스 드래그: 회전
   - Shift + 마우스 드래그: 팬
   - 휠: 줌

## 개발 환경

- Node.js 18+
- npm 또는 yarn
- TypeScript 지원 IDE 권장
