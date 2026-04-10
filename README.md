# MCP

[SideOnAI](https://www.sideonai.com) 협업 문의하기 폼을 [Playwright](https://playwright.dev)로 자동 입력·전송해 동작을 확인하는 스크립트입니다.

## 요구 사항

- Node.js 18+
- Chromium(스크립트 최초 실행 전 아래 설치 명령 실행)

## 설치

```bash
npm install
npx playwright install chromium
```

## 실행

```bash
node contact-test.mjs
```

또는

```bash
npm run test:contact
```

## 설정

`contact-test.mjs` 안의 `form` 객체에서 이름, 이메일, 회사/소속, 문의 내용을 수정할 수 있습니다.

실제 사이트로 문의가 전송되므로, 테스트 시 내용을 확인해 주세요.
