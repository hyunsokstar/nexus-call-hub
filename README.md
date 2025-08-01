# Nexus Call Hub - Tauri + React + TypeScript

전화 상담 시스템을 위한 멀티윈도우 데스크톱 애플리케이션

## 📋 **필수 사전 요구사항**

### **1. Rust 설치**
```bash
# Windows (PowerShell)
winget install Rustlang.Rustup

# macOS/Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 설치 확인
rustc --version
cargo --version
```

### **2. Node.js 설치**
```bash
# Windows (PowerShell)
winget install OpenJS.NodeJS

# macOS (Homebrew)
brew install node

# 설치 확인
node --version
npm --version
```

### **3. 시스템별 추가 의존성**

#### **Windows:**
```bash
# Visual Studio Build Tools 설치
winget install Microsoft.VisualStudio.2022.BuildTools

# 또는 Visual Studio Community
winget install Microsoft.VisualStudio.2022.Community
```

#### **macOS:**
```bash
# Xcode Command Line Tools
xcode-select --install
```

#### **Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

---

## 🚀 **프로젝트 설정 및 실행**

### **1. 프로젝트 클론 및 의존성 설치**
```bash
# 프로젝트 클론
git clone <repository-url>
cd nexus-call-hub

# Node.js 의존성 설치
npm install

# Rust 의존성은 자동으로 처리됨
```

### **2. 개발 서버 실행**
```bash
# 개발 모드 실행 (권장)
npm run tauri dev

# 또는 Cargo 직접 사용
cargo tauri dev
```

### **3. 프로덕션 빌드**
```bash
# 실행 파일 빌드
npm run tauri build

# 또는 Cargo 직접 사용
cargo tauri build
```

---

## 📁 **프로젝트 구조**

```
nexus-call-hub/
├── src/                          # React 프론트엔드
│   ├── App.tsx                   # 메인 React 컴포넌트
│   ├── main.tsx                  # React 엔트리 포인트
│   └── styles.css                # 스타일시트
├── src-tauri/                    # Rust 백엔드
│   ├── src/
│   │   ├── main.rs              # Tauri 메인 파일
│   │   └── window.rs            # 윈도우 관리 모듈
│   ├── Cargo.toml               # Rust 의존성
│   ├── tauri.conf.json          # Tauri 설정
│   └── build.rs                 # 빌드 스크립트
├── public/                       # 정적 파일들
├── package.json                  # Node.js 설정
├── vite.config.ts               # Vite 빌드 설정
└── tsconfig.json                # TypeScript 설정
```

---

## 🛠️ **주요 개발 명령어**

### **개발 관련:**
```bash
# 개발 서버 시작 (핫 리로드)
npm run tauri dev

# 프론트엔드만 개발 서버
npm run dev

# TypeScript 타입 체크
npm run type-check

# 린트 검사
npm run lint
```

### **빌드 관련:**
```bash
# 개발용 빌드
npm run build

# 프로덕션 실행 파일 생성
npm run tauri build

# 아이콘 생성 (512x512 PNG 파일로부터)
npm run tauri icon app-icon.png
```

### **Rust 관련:**
```bash
# Rust 의존성 업데이트
cargo update

# Rust 코드만 컴파일 체크
cargo check

# Rust 테스트 실행
cargo test

# Rust 포맷팅
cargo fmt

# Rust 린트
cargo clippy
```

---

## 🖥️ **멀티윈도우 시스템**

### **현재 구현된 윈도우:**
- **Launcher**: 메인 허브 윈도우 (400x500)
- **Login**: 상담사 로그인 (350x300) - 준비중
- **Call**: 전화 걸기 제어 (320x550) - 준비중

### **윈도우 추가 방법:**
1. `src-tauri/src/window.rs`에서 `WindowType` enum에 새 타입 추가
2. `WindowConfigs::get()` 메서드에 새 윈도우 설정 추가
3. 필요시 새 HTML/React 컴포넌트 생성

---

## 🔧 **개발 환경 설정**

### **권장 VS Code 확장:**
```json
{
  "recommendations": [
    "tauri-apps.tauri-vscode",
    "rust-lang.rust-analyzer", 
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### **VS Code 설정 (.vscode/settings.json):**
```json
{
  "rust-analyzer.linkedProjects": ["./src-tauri/Cargo.toml"],
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

---

## 🐛 **트러블슈팅**

### **일반적인 문제들:**

#### **1. "command not found: cargo"**
```bash
# PATH에 Cargo 추가 (Windows)
$env:PATH += ";$env:USERPROFILE\.cargo\bin"

# 또는 새 터미널 세션 시작
# 또는 시스템 재부팅
```

#### **2. 컴파일 에러: "linking with cc failed"**
```bash
# Windows: Visual Studio Build Tools 설치 필요
# Linux: build-essential 패키지 설치 필요
# macOS: Xcode Command Line Tools 설치 필요
```

#### **3. "WebviewWindowBuilder not found"**
```bash
# Tauri 버전 확인
cargo --version
npm list @tauri-apps/cli

# 버전 2.x 이상인지 확인
# 필요시 업데이트
cargo install tauri-cli
npm install @tauri-apps/cli@latest
```

#### **4. 윈도우가 열리지 않음**
```bash
# 로그 확인
npm run tauri dev -- --verbose

# 캐시 정리
rm -rf target/
rm -rf dist/
npm run tauri dev
```

#### **5. 핫 리로드가 작동하지 않음**
```bash
# 포트 충돌 확인
netstat -ano | findstr :1420

# 다른 포트 사용
npm run dev -- --port 3000
```

---

## 📚 **추가 자료**

### **프로젝트 참고 자료:**
- **[Tauri 스타터 가이드](https://nexus-task-master.shop/pilot-project/tauri-starter)** - 프로젝트 초기 설정 및 구조
- **[Rust 기본 문법 - 1페이지](https://nexus-task-master.shop/note-admin/notes/95/note-contents?pageNum=1)** - Rust 기초 문법
- **[Rust 기본 문법 - 2페이지](https://nexus-task-master.shop/note-admin/notes/95/note-contents?pageNum=2)** - Rust 고급 문법

### **공식 문서:**
- [Tauri 가이드](https://v2.tauri.app/start/)
- [Tauri API 레퍼런스](https://v2.tauri.app/reference/)
- [React 문서](https://react.dev/)
- [TypeScript 문서](https://www.typescriptlang.org/)
- [Rust 공식 문서](https://doc.rust-lang.org/)

### **학습 순서 (추천):**
1. **[Rust 기본 문법](https://nexus-task-master.shop/note-admin/notes/95/note-contents?pageNum=1)** 먼저 학습
2. **[Tauri 스타터 가이드](https://nexus-task-master.shop/pilot-project/tauri-starter)** 따라하기
3. **현재 프로젝트** 실습하기
4. **[고급 Rust 문법](https://nexus-task-master.shop/note-admin/notes/95/note-contents?pageNum=2)** 적용하기

### **유용한 명령어:**
```bash
# Tauri 프로젝트 정보 확인
npm run tauri info

# 사용 가능한 Tauri 명령어 보기
npm run tauri --help

# 플랫폼별 빌드 타겟 확인
npm run tauri build --help
```

---

## 🔐 **보안 고려사항**

### **CSP (Content Security Policy):**
`src-tauri/tauri.conf.json`에서 보안 정책 설정

### **API 권한:**
필요한 Tauri API만 활성화하여 보안 강화

### **자동 업데이트:**
프로덕션 환경에서는 Tauri 자동 업데이트 기능 고려

---

## 📖 **라이선스**

MIT License - 자세한 내용은 LICENSE 파일 참조

---

## 🤝 **기여하기**

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 **지원**

문제가 발생하면 다음을 확인해보세요:

1. **시스템 요구사항** 모두 설치되었는지 확인
2. **최신 버전** 사용 중인지 확인
3. **에러 로그** 자세히 읽어보기
4. **공식 문서** 참조
5. **Issues** 탭에서 유사한 문제 검색

**Happy Coding!** 🚀