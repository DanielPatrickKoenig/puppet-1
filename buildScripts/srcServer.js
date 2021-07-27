
const puppeteer = require('puppeteer');
const pages = [];
let browser;
let captureCount = 0;
(async () => {
  browser = await puppeteer.launch({headless: false});
  await navigate('https://www.github.com/login');
})();

async function getCurrentPage(){
  const pages = await browser.pages();
  return pages[0];
}

async function navigate(url, newPage=false){
  const pages = await browser.pages();
  await pages[0].goto(url);
}

async function enterText(selector, text){
  const page = await getCurrentPage();
  await page.type(selector, text);
}

async function click(selector){
  const page = await getCurrentPage();
  try{
    const htmlEl = await page.$(selector);
    await htmlEl.click();
  }
  catch(e){
    setTimeout(() => {
      click(selector);
    }, 1000);
  }
}

async function capture(){
  captureCount++;
  const page = await getCurrentPage();
  await page.screenshot({ path: `capture-${captureCount}.png` });
}

async function basicLogin({ usernameSelector, username}, { passwordSelector, password }, submitSelector){
  await enterText(usernameSelector, username);
  await enterText(passwordSelector, password);
  await click(submitSelector);
}
