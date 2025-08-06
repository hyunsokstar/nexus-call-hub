# Nexus Call Hub - 설치부터 실행까지 완벽 가이드

> 🚀 **Rust/Tauri를 처음 접하는 분들을 위한 A to Z 가이드**

## 📌 시작하기 전에

이 가이드는 **Windows 10/11** 기준이며, 개발 경험이 전혀 없어도 따라할 수 있습니다.  
총 소요시간: 약 30분

---

## 🔧 Step 1: 필수 프로그램 설치 (순서대로!)

### 1-1. Visual Studio Build Tools 설치 (필수!)
> Rust 컴파일에 반드시 필요합니다.

1. [다운로드 링크](https://visualstudio.microsoft.com/ko/visual-cpp-build-tools/) 클릭
2. **"Build Tools 다운로드"** 버튼 클릭
3. 다운로드된 파일 실행
4. 설치 옵션에서 **"C++를 사용한 데스크톱 개발"** 체크
5. 설치 (약 5-10분 소요)
6. **PC 재시작** (중요!)

### 1-2. Node.js 설치
> JavaScript 실행 환경입니다.

1. [Node.js 공식 사이트](https://nodejs.org/ko/) 접속
2. **LTS 버전** 다운로드 (왼쪽 초록색 버튼)
3. 다운로드된 파일 실행
4. 모든 옵션 기본값으로 Next → Next → Install
5. 설치 완료

**✅ 확인 방법:**
```powershell
# PowerShell 열고 입력
node --version
# v20.x.x 같은 버전이 나오면 성공
```

### 1-3. Rust 설치
> Tauri의 핵심 언어입니다.

1. [Rust 설치 페이지](https://www.rust-lang.org/tools/install) 접속
2. **"64-BIT 다운로드"** 클릭 (rustup-init.exe)
3. 다운로드된 파일 실행
4. 검은 창이 열리면 **Enter** 키 누르기 (기본 설치)
5. 설치 완료 후 **Enter** 한 번 더
6. **PowerShell 완전히 종료 후 다시 열기** (중요!)

**✅ 확인 방법:**
```powershell
# 새 PowerShell에서 입력
rustc --version
# rustc 1.x.x 같은 버전이 나오면 성공
```

### 1-4. Git 설치 (선택사항)
> 프로젝트를 다운로드할 때 필요합니다.

1. [Git 다운로드](https://git-scm.com/download/win) 페이지 접속
2. **64-bit Git for Windows Setup** 클릭
3. 다운로드된 파일 실행
4. 모든 옵션 기본값으로 Next → Next → Install
5. 설치 완료

---

## 📦 Step 2: 프로젝트 다운로드 및 설정

### 2-1. 프로젝트 다운로드

**방법 A: Git 사용 (권장)**
```powershell
# PowerShell에서 실행
cd C:\
git clone https://github.com/hyunsokstar/nexus-call-hub.git
cd nexus-call-hub
```

**방법 B: ZIP 다운로드**
1. [GitHub 저장소](https://github.com/hyunsokstar/nexus-call-hub) 접속
2. 초록색 **Code** 버튼 클릭
3. **Download ZIP** 클릭
4. C:\ 드라이브에 압축 해제
5. 폴더명을 `nexus-call-hub`로 변경

### 2-2. 프로젝트 폴더로 이동
```powershell
# PowerShell에서 실행
cd C:\nexus-call-hub
```

### 2-3. 필요한 패키지 설치
```powershell
# PowerShell에서 실행 (약 3-5분 소요)
npm install
```

⚠️ **에러가 나는 경우:**
```powershell
# 캐시 정리 후 재시도
npm cache clean --force
npm install
```

---

## 🎮 Step 3: 프로그램 실행

### 3-1. 개발 모드로 실행
```powershell
# PowerShell에서 실행
npm run tauri dev
```

**첫 실행시:**
- Rust 패키지 다운로드로 5-10분 소요됩니다
- "Windows 보안 경고" 창이 뜨면 **"액세스 허용"** 클릭
- 자동으로 앱 창이 열립니다!

### 3-2. 실행 파일 만들기 (배포용)
```powershell
# PowerShell에서 실행 (약 10-15분 소요)
npm run tauri build
```

**완성된 실행 파일 위치:**
```
C:\nexus-call-hub\src-tauri\target\release\nexus-call-hub.exe
```

---

## 🚨 자주 발생하는 문제와 해결법

### 문제 1: "cargo가 없다"는 에러
```powershell
# 해결방법: PowerShell 재시작 후
rustup default stable
```

### 문제 2: "cannot find cc.exe" 에러
```powershell
# 해결방법: Visual Studio Build Tools 재설치
# 설치시 "C++를 사용한 데스크톱 개발" 체크 확인!
```

### 문제 3: npm install 실패
```powershell
# 해결방법: 관리자 권한으로 PowerShell 실행
# 시작 메뉴 → PowerShell 우클릭 → "관리자 권한으로 실행"
npm cache clean --force
npm install --force
```

### 문제 4: 빌드는 되는데 실행이 안 됨
```powershell
# 해결방법: Windows Defender 예외 추가
# Windows 보안 → 바이러스 및 위협 방지 → 제외 추가
# C:\nexus-call-hub 폴더 추가
```

### 문제 5: 포트 충돌 (1420 포트 사용 중)
```powershell
# 해결방법: 다른 Tauri 앱 종료 또는
npm run tauri dev -- --port 3000
```

---

## 📝 개발 명령어 정리

| 명령어 | 설명 | 사용 시기 |
|--------|------|-----------|
| `npm run tauri dev` | 개발 모드 실행 | 개발/테스트할 때 |
| `npm run tauri build` | 실행 파일 생성 | 배포할 때 |
| `npm install` | 패키지 설치 | 처음 또는 package.json 변경시 |
| `npm run dev` | 웹 버전만 실행 | 프론트엔드만 테스트할 때 |

---

## 🎯 빠른 시작 체크리스트

- [ ] Visual Studio Build Tools 설치 완료
- [ ] Node.js 설치 완료 (`node --version` 확인)
- [ ] Rust 설치 완료 (`rustc --version` 확인)
- [ ] 프로젝트 다운로드 완료
- [ ] `npm install` 완료
- [ ] `npm run tauri dev`로 앱 실행 성공

모든 체크박스를 완료했다면 개발 준비 완료! 🎉

---

## 💡 추가 팁

### VS Code 설치 (권장)
코드 편집을 위해 [Visual Studio Code](https://code.visualstudio.com/) 설치를 권장합니다.

### 폴더 구조 이해
```
nexus-call-hub/
├── src/              # 화면(React) 코드
├── src-tauri/        # 백엔드(Rust) 코드
└── package.json      # 프로젝트 설정
```

### 코드 수정하기
- `src/` 폴더의 파일 수정 → 화면 변경
- `src-tauri/` 폴더의 파일 수정 → 기능 변경
- 개발 모드에서는 수정사항이 자동 반영됩니다

---

## 🚀 GitHub Actions 자동 빌드 (선택사항)

### 자동 릴리스 설정
GitHub에서 태그를 푸시하면 자동으로 실행 파일이 빌드되어 릴리스됩니다.

```powershell
# 1. GitHub Actions 워크플로우 파일 커밋
git add .github/workflows/release.yml
git commit -m "ci: add release workflow"
git push origin main

# 2. 릴리스 태그 생성 및 푸시
git tag v1.0.0
git push origin v1.0.0  # 이때 Actions가 자동 실행됨!
```

### 빌드 결과 확인
1. [GitHub 저장소](https://github.com/hyunsokstar/nexus-call-hub) 접속
2. **Actions** 탭에서 빌드 상태 확인
3. **Releases** 탭에서 자동 생성된 실행 파일 다운로드

### 자동 빌드 지원 플랫폼
- ✅ Windows (MSI, EXE)
- ✅ macOS (DMG, APP)
- ✅ Linux (AppImage, DEB)

---

## 🆘 도움이 필요하신가요?

1. 에러 메시지를 **정확히** 복사해서 검색
2. [Tauri Discord](https://discord.com/invite/tauri) 커뮤니티
3. [GitHub Issues](https://github.com/hyunsokstar/nexus-call-hub/issues)에 문의

---

## 🎊 축하합니다!

여기까지 따라오셨다면 Tauri 앱 개발 환경 구축을 완료하신 것입니다!  
이제 코드를 수정하고 자신만의 앱을 만들어보세요.

**Happy Coding!** 🚀