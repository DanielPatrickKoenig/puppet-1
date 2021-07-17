
const puppeteer = require('puppeteer');
const pages = [];
let browser;
let captureCount = 0;
(async () => {
  browser = await puppeteer.launch({headless: false});
  await navigate('https://www.github.com/login');
})();

function getCurrentPage(){
  return pages.length ? pages[pages.length - 1] : null;
}

async function navigate(url, newPage=false){
  const page = await browser.newPage();
  if(!getCurrentPage() || newPage){
    pages.push(page);
  }
  await getCurrentPage().goto(url);
}

async function enterText(selector, text){
  await getCurrentPage().type(selector, text);
}

async function click(selector){
  const htmlEl = await getCurrentPage().$(selector);
  await htmlEl.click();
}

async function capture(){
  captureCount++;
  await getCurrentPage().screenshot({ path: `capture-${captureCount}.png` });
}

async function basicLogin({ usernameSelector, username}, { passwordSelector, password }, submitSelector){
  await enterText(usernameSelector, username);
  await enterText(passwordSelector, password);
  await click(submitSelector);
}
