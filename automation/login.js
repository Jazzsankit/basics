// automation code
// puppeteer ke functions => pending promise dete hain
const puppeteer = require("puppeteer");

// build a browser / open a browser
let tab;
let idx;
let gCode;
let browserOpenPromise = puppeteer.launch({
  headless: false,
  defaultViewport: null,
  args: ["--start-maximized"],
});

browserOpenPromise
  .then(function (browser) {
    let pagesPromise = browser.pages();
    return pagesPromise;
  })
  .then(function (pages) {
    // in array
    let page = pages[0];
    tab = page;
    let pageOpenedPromise = page.goto("https://www.hackerrank.com/auth/login");
    return pageOpenedPromise;
  })
  .then(function () {
    let idTypedPromise = tab.type("#input-1", "tifet30346@gmajs.net");
    return idTypedPromise;
  })
  .then(function () {
    let pwTypedPromise = tab.type("#input-2", "12345678");
    return pwTypedPromise;
  })
  .then(function () {
    // login btn clicked
    let loginBtnClickedPromise = tab.click(
      ".ui-btn.ui-btn-large.ui-btn-primary.auth-button"
    );
    return loginBtnClickedPromise;
  })
  .then(function () {
    let waitAndClickPromise = waitAndClick("#base-card-1-link");
    return waitAndClickPromise;
  })
  .then(function () {
    let waitPromise = waitAndClick('a[data-attr1="warmup"]');
    return waitPromise;
  })
  .then(function () {
    let waitPromise = tab.waitForSelector(
      ".js-track-click.challenge-list-item",
      { visible: true }
    );
    return waitPromise;
  })
  .then(function () {
    let allQuestionsPromise = tab.$$(".js-track-click.challenge-list-item");
    return allQuestionsPromise;
  })
  .then(function (allQuestions) {
    // [ <a> </a>  ,  <a> </a>  ,  <a> </a>   ]
    let allLinksPromise = [];
    for (let i = 0; i < allQuestions.length; i++) {
      let linkPendingPromise = tab.evaluate(function (elem) {
        return elem.getAttribute("href");
      }, allQuestions[i]);
      allLinksPromise.push(linkPendingPromise);
    }
    let allQuestionsPromise = Promise.all(allLinksPromise);
    return allQuestionsPromise;
  })
  .then(function (allLinks) {
    let completeLinks = [];
    for (let i = 0; i < allLinks.length; i++) {
      let completeLink = "https://www.hackerrank.com" + allLinks[i];
      completeLinks.push(completeLink);
    }
    //   console.log(completeLinks);
    let solveFirstQuespromise=solveQuestion(completeLinks[0]);
    for(let i=1;i<completeLinks.length;i++){
      solveFirstQuespromise=solveFirstQuespromise.then(function(){
          let nextQuesKaPromise = solveQuestion(completeLinks[i]);
          return nextQuesKaPromise;
      })
    }
  })
  .then(function () {
    console.log("all questions solved !!!");
  })
  .catch(function (error) {
    console.log(error);
  });

function waitAndClick(selector) {
  return new Promise(function (resolve, reject) {
    let waitPromise = tab.waitForSelector(selector, { visible: true });
    waitPromise
      .then(function () {
        let clickedPromise = tab.click(selector);
        return clickedPromise;
      })
      .then(function () {
        resolve();
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

function getCode() {
  return new Promise(function (resolve, reject) {
    let waitPromise = tab.waitForSelector(".hackdown-content h3");
    waitPromise
      .then(function () {
        let allCodeNamesPromise = tab.$$(".hackdown-content h3");
        return allCodeNamesPromise;
      })
      .then(function (allCodesNames) {
        // [ <h3>C++</h3> , <h3>Python</h3> , <h3>Java</h3>  ]
        let allCodeNamesP = [];
        //[ Promise<pending>  ,Promise<pending>  ,Promise<pending>];
        for (let i = 0; i < allCodesNames.length; i++) {
          let namePromise = tab.evaluate(function (elem) {
            return elem.textContent;
          }, allCodesNames[i]);
          allCodeNamesP.push(namePromise);
        }
        let promiseAllCodeNames = Promise.all(allCodeNamesP);
        return promiseAllCodeNames;
      })
      .then(function (allCodesNames) {
        for (let i = 0; i < allCodesNames.length; i++) {
          if (allCodesNames[i] == "C++") {
            idx = i;
            break;
          }
        }
        let allCodesDivPromise = tab.$$(".hackdown-content .highlight");
        return allCodesDivPromise;
      })
      .then(function (allCodesDiv) {
        //[ <div> </div> , <div> </div> , <div> </div>];
        let codeDiv = allCodesDiv[idx];
        let codePromise = tab.evaluate(function (elem) {
          return elem.textContent;
        }, codeDiv);
        return codePromise;
      })
      .then(function (code) {
        gCode = code;
        resolve();
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

function solveQuestion(qLink) {
  return new Promise(function (resolve, reject) {
    let questionGotoPromise = tab.goto(qLink);
    questionGotoPromise
      .then(function () {
        console.log("opened question !!");
      })
      .then(function () {
        let waitPromise = waitAndClick("#tab-1-item-4");
        return waitPromise;
      })
      .then(function () {
        let codePromise = getCode();
        return codePromise;
      })
      .then(function () {
        let clickedPromise = tab.click("#tab-1-item-0");
        return clickedPromise;
      })
      .then(function () {
        let codePastedPromise = pasteCode();
        return codePastedPromise;
      })
      .then(function () {
        let submitClickedPromise = tab.click(".ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled");
        return submitClickedPromise;
      })
      .then(function(){
          console.log("one questions submitted !!");
      })
  });
}
function pasteCode() {
  return new Promise(function (resolve, reject) {
    let waitAndClickPromise = waitAndClick(".checkbox-input");
    waitAndClickPromise
      .then(function () {
        tab.setDfa
        let codeTypedPromise = tab.type(".monaco-editor.no-user-select.vs .inputarea", gCode);
        return codeTypedPromise;
      })
      .then(function () {
        let ctrlKeyHoldPromise = tab.keyboard.down("Control");
        return ctrlKeyHoldPromise;
      })
      .then(function () {
        let aKeyPressPromise = tab.keyboard.press("a");
        return aKeyPressPromise;
      })
      .then(function () {
        let xKeyPressPromise = tab.keyboard.press("x");
        return xKeyPressPromise;
      })
      .then(function () {
        let codeBoxClickedPromise = tab.click(
          ".monaco-editor.no-user-select.vs"
        );
        return codeBoxClickedPromise;
      })
      .then(function () {
        let aKeyPressPromise = tab.keyboard.press("a");
        return aKeyPressPromise;
      })
      .then(function () {
        let vKeyPressPromise = tab.keyboard.press("v");
        return vKeyPressPromise;
      })
      .then(function () {
        resolve();
      })
      .catch(function (error) {
        reject(error);
      });
  });
}
