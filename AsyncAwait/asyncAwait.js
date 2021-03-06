const puppeteer = require("puppeteer");
const challenges = require("./challenges");
// [  {} , {} , {} , {} ,{}  ]

let tab;

(async function () {
  try {
    let browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--start-maximized"],
    })
    let pages = await browser.pages();
    let page = pages[0];
    tab = page;
    await page.goto("https://www.hackerrank.com/auth/login");
    await page.type("#input-1", "tifet30346@gmajs.net");
    await page.type("#input-2", "12345678");    
    await Promise.all([ page.waitForNavigation({waitUntil:"networkidle0"})   , page.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button") ]);
    await page.waitForSelector('.dropdown.profile-menu.theme-m-content' , {visible:true}); 
    page.waitForTimeout(1000);
    await page.click('.dropdown.profile-menu.theme-m-content');
    await Promise.all([ page.waitForNavigation({waitUntil:"networkidle0"})   , page.click('.dropdown.profile-menu.theme-m-content')]);
    await page.waitForSelector('a[data-analytics="NavBarProfileDropDownAdministration"]' , {visible:true});
    let bothLis = await page.$$("a[data-analytics='NavBarProfileDropDownAdministration']");
    let manageChallenge = bothLis[bothLis.length-1];
    // <li>  </li>   
    // manage challenge page
    await Promise.all([ page.waitForNavigation({waitUntil:"networkidle0"})   , manageChallenge.click() ]);
    let manageChallengeUrl = await page.url(); //https://www.hackerrank.com/administration/challenges
    
    // create challenge page
    await Promise.all([ page.waitForNavigation({waitUntil:"networkidle0"})   , page.click(".btn.btn-green.backbone.pull-right")]);
    // pending promise to create one challenge
    await createChallenge(challenges[0]);

    for(let i=1 ; i<challenges.length ; i++){
        await tab.goto(manageChallengeUrl);
        await Promise.all([ page.waitForNavigation({waitUntil:"networkidle0"})   , page.click(".btn.btn-green.backbone.pull-right")]);
        await createChallenge(challenges[i]);
    }
    await tab.goto("https://www.hackerrank.com/dashboard?h_r=logo");
  } 
  catch (error) {
      console.log(error);
  }
})();
// challenge = {
//     "Challenge Name": "Pep_Java_1GettingStarted_1IsPrime",
//     "Description": "Question 1",
//     "Problem Statement": "Take as input a number n. Determine whether it is prime or not. If it is prime, print 'Prime' otherwise print 'Not Prime.",
//     "Input Format": "Integer",
//     "Constraints": "n <= 10 ^ 9",
//     "Output Format": "String",
//     "Tags": "Basics"
//   }

async function createChallenge(challenge){
    try{
        let name = challenge["Challenge Name"];
        let description = challenge["Description"];
        let problem = challenge["Problem Statement"];
        let input = challenge["Input Format"];
        let constraints = challenge["Constraints"];
        let output = challenge["Output Format"];
        let tags = challenge["Tags"];
        await tab.waitForSelector("#name" , {visible:true});
        await tab.type("#name" , name );
        await tab.type("#preview" , description );
        await tab.type("#problem_statement-container .CodeMirror textarea" , problem);
        await tab.type("#input_format-container .CodeMirror textarea" , input);
        await tab.type("#constraints-container .CodeMirror textarea"   , constraints);
        await tab.type("#output_format-container .CodeMirror textarea" , output);
        await tab.type("#tags_tag" , tags);
        await tab.keyboard.press("Enter");
        await tab.click(".save-challenge.btn.btn-green");
    }
    catch(error){
        return error;
    }
}
//.profile-nav-item-link