const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  page.on("console", msg => console.log("PAGE LOG:", msg.text()));
  
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
  
  // click enter button
  await page.evaluate(() => {
     const btns = Array.from(document.querySelectorAll('button'));
     const enterBtn = btns.find(b => b.textContent.includes('ENTER COMMAND CENTER') || b.textContent.includes('ACCESS'));
     if(enterBtn) enterBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  // switch to password view
  await page.evaluate(() => {
     const btns = Array.from(document.querySelectorAll('button'));
     const pwdBtn = btns.find(b => b.textContent.includes('USE PASSWORD'));
     if(pwdBtn) pwdBtn.click();
  });

  await new Promise(r => setTimeout(r, 1000));

  // enter email and password
  await page.type('input[type="email"]', 'test1@example.com');
  await page.type('input[type="password"]', 'testpassword123');

  // submit
  await page.evaluate(() => {
     const btns = Array.from(document.querySelectorAll('button'));
     const loginBtn = btns.find(b => b.textContent.includes('LOG IN'));
     if(loginBtn) loginBtn.click();
  });

  await new Promise(r => setTimeout(r, 2000));

  // look for error text
  const content = await page.content();
  if (content.includes("Authentication failed") || content.includes("error")) {
    console.log("Found error on page!");
    // Dump actual text
    const errorText = await page.evaluate(() => {
      const errEl = document.querySelector('.text-danger');
      return errEl ? errEl.textContent : 'none';
    });
    console.log("ERROR TEXT:", errorText);
  }

  await browser.close();
})();
