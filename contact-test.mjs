import { chromium } from "playwright";

const BASE = "https://www.sideonai.com";

const form = {
  name: "남대희",
  email: "cesare713@hanmail.net",
  company: "테스트 (Playwright)",
  message: "Playwright 자동 테스트 문의입니다. 정상 제출 여부 확인용입니다.",
};

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];

  try {
    await page.goto(BASE, { waitUntil: "networkidle", timeout: 60_000 });

    const nameInput = page.getByRole("textbox", { name: /이름/i }).first();
    const emailInput = page.getByRole("textbox", { name: /이메일/i }).first();
    const companyInput = page
      .getByRole("textbox", { name: /회사|소속/i })
      .first();
    const messageInput = page
      .getByRole("textbox", { name: /문의 내용/i })
      .first();

    await nameInput.fill(form.name);
    await emailInput.fill(form.email);
    await companyInput.fill(form.company);
    await messageInput.fill(form.message);

    const submit = page.getByRole("button", { name: /문의 전송/i });
    const responsePromise = page
      .waitForResponse(
        (r) =>
          r.request().method() === "POST" &&
          (r.url().includes("form") ||
            r.url().includes("contact") ||
            r.url().includes("inquiry") ||
            r.url().includes("sideonai")),
        { timeout: 30_000 }
      )
      .catch(() => null);

    await submit.click();

    const postResp = await responsePromise;
    await page.getByText("전송 중").waitFor({ state: "hidden", timeout: 60_000 }).catch(() => {});

    const url = page.url();
    const bodyText = await page.locator("body").innerText().catch(() => "");

    const sending = /전송 중/.test(bodyText);
    const successHints =
      /감사|완료|접수되|보내|성공|thank|success|전송되었/i.test(bodyText) &&
      !sending;

    console.log(JSON.stringify({
      ok: true,
      finalUrl: url,
      httpPost: postResp
        ? { url: postResp.url(), status: postResp.status() }
        : null,
      stillSending: sending,
      successHints,
      snippet: bodyText.slice(0, 800),
    }, null, 2));
  } catch (e) {
    errors.push(String(e?.message || e));
    console.log(JSON.stringify({ ok: false, errors }, null, 2));
    await page.screenshot({ path: "contact-error.png", fullPage: true }).catch(() => {});
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main();
