import puppeteer from 'puppeteer';

const getRandomArbitrary = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min);

const range = (n: number): Array<number> => Array.from(Array(n).keys())

const mainFillSurvey = async () => {
    const browser: puppeteer.Browser = await puppeteer.launch();
    const page: puppeteer.Page = await browser.newPage();
    page.setViewport({
        width: 1280,
        height: 800,
        isMobile: false,
    });
    await page.goto('the-secret-form-xD', { waitUntil: "networkidle2", });

    const containerQuestions: Array<puppeteer.ElementHandle<Element>> = await page.$$('div[class="freebirdFormviewerViewNumberedItemContainer"]');
    
    const questionRadioChoice = await Promise.all(containerQuestions.map(async (el: puppeteer.ElementHandle<Element>) => {
        const questionRadioChoice: Array<puppeteer.ElementHandle<Element>> = await el.$$('div[class="freebirdFormviewerComponentsQuestionRadioChoice freebirdFormviewerComponentsQuestionRadioOptionContainer"]');
        const randomSelect: number = getRandomArbitrary(0, questionRadioChoice.length);
        return questionRadioChoice[randomSelect]
    }));

    questionRadioChoice.forEach(async (el: puppeteer.ElementHandle<Element>) => {
        el.$('div[role="radio"]')
        .then(async (e: puppeteer.ElementHandle<Element> | null) => {
            await e?.click();
        }).catch(err => console.log(err));
    });

    // await page.screenshot({ path: `./src/captures/capt-prev-${Date.now()}.png`, fullPage: true });
    await page.click('div[role="button"]');
    await page.waitForNavigation();
    // await page.screenshot({ path: `./src/captures/capt-next-${Date.now()}.png`, fullPage: true });
    await browser.close();
};

try {
    Promise.all(range(2).map(async () => await mainFillSurvey()));
} catch (error) {
    console.error(error);
}