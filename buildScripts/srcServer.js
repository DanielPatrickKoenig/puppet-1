
const puppeteer = require('puppeteer');
const pages = [];
let browser;
let captureCount = 0;
(async () => {
  browser = await puppeteer.launch({headless: false});
  // await navigate('https://www.github.com/login');
  const username = '';
  const password = '';
  const actions = [
    {
      actionType: ActionTypes.NAVIGATE,
      url: 'https://www.github.com/login'
    },
    {
      actionType: ActionTypes.ENTER_TEXT,
      selector: '#login_field',
      content: username
    },
    {
      actionType: ActionTypes.ENTER_TEXT,
      selector: '#password',
      content: password
    },
    {
      actionType: ActionTypes.CLICK,
      selector: '#password ~ .btn'
    },
    {
      actionType: ActionTypes.NAVIGATE,
      url: `https://github.com/${username}?tab=repositories`
    },
    {
      actionType: ActionTypes.CLICK,
      selector: '.js-profile-editable-replace a, h2 a'
    }
  ];
  await actionChain(actions);
})();

const ActionTypes = {
  NAVIGATE: 0,
  CLICK: 1,
  ENTER_TEXT: 2
};

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
  let status = 0;
  try{
    await page.type(selector, text);
    status = 1;
  }
  catch(e){
    // console.log(e);
    setTimeout(async () => {
      await enterText(selector, text);
    }, 1000);
  }
  return status;
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
    // console.log(e);
    setTimeout(async () => {
      await click(selector);
    }, 1000);
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
      status = await click(currentAction.selector);
      break;
    }
    case ActionTypes.ENTER_TEXT:{
      status = await enterText(currentAction.selector, currentAction.content);
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
