import actions from './actions.js';
import ActionTypes from './actionTypes.js';
const puppeteer = require('puppeteer');
let windowIndex = 0;
let browser;
let captureCount = 0;
(async () => {
  browser = await puppeteer.launch({headless: false});
  await actionChain(actions);
})();



async function getCurrentPage(){
  const pages = await browser.pages();
  return pages[windowIndex];
}

async function navigate(url){
  const pages = await browser.pages();
  await pages[windowIndex].goto(url);
}

async function enterText(selector, text){
  const page = await getCurrentPage();
  let status = 0;
  try{
    await page.type(selector, text);
    status = 1;
  }
  catch(e){
    console.log(e);
  }
  return status;
}

async function mouseClick({ x, y }) {
  const page = await getCurrentPage();
  page.mouse.click(x, y);
  return 1;
}

async function mouseDown() {
  const page = await getCurrentPage();
  page.mouse.down();
  return 1;
}

async function mouseMove({ x, y }) {
  const page = await getCurrentPage();
  page.mouse.move(x, y);
  return 1;
}

async function mouseUp() {
  const page = await getCurrentPage();
  page.mouse.up();
  return 1;
}

async function click(selector){
  const page = await getCurrentPage();
  let status = 0;
  try{
    const htmlEl = await page.$(selector);
    await htmlEl.click();
    status = 1;
  }
  catch(e){
    console.log(e);
  }
  return status;
  
}

async function actionChain(chain, index){
  console.log(index);
  if(index === undefined){
    index = 0;
  }
  let status = 0;
  const currentAction = chain[index];
  switch (currentAction.actionType){
    case ActionTypes.NAVIGATE:{
      await navigate(currentAction.url);
      status = 1;
      break;
    }
    case ActionTypes.CLICK:{
      status = currentAction.selector ? await click(currentAction.selector) : await mouseClick(currentAction.position);
      break;
    }
    case ActionTypes.MOUSE_DOWN:{
      status = await mouseDown();
      break;
    }
    case ActionTypes.MOUSE_MOVE:{
      status = await mouseMove(currentAction.position);
      break;
    }
    case ActionTypes.MOUSE_UP:{
      status = await mouseUp();
      break;
    }
    case ActionTypes.ENTER_TEXT:{
      status = await enterText(currentAction.selector, currentAction.content);
      break;
    }
    case ActionTypes.CHANGE_WINDOW:{
      windowIndex = currentAction.index;
      status = 1;
      break;
    }
  }
  if(index < chain.length){
    actionChain(chain, index + status);
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
