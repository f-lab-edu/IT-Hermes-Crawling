const commonFunc = require('../../common');
const puppeteer = commonFunc.puppeteer;

let request = commonFunc.request;
let cheerio = commonFunc.cheerio;


/* DB에서 가져올 custom data*/
/* 구독 리스트 */
let subScribeList = [];
/* 최근 크롤링한 날짜 혹은 shortenUrl */
let last;

const express = commonFunc.express;
const router = express.Router();

// 크롤링한 데이터
let crawingData=[]; 
const defaultUrl = "https://www.youtube.com";

/* 유튜브 데이터 조회 */
router.get('/', async (req, res, next) => {

    /* 임의로 데이터 삽입, 추후 DB에서 가져오는 메소드를 만들 계획 */
    subScribeList.push("@nomadcoders");
    last = "fJeGAx27-vU";

    for(let i=0;i<subScribeList.length;i++) {
        await youtubeCallBack(insertCustomParameterUrl(subScribeList[i]));
    }
    res.json(crawingData);
});

const insertCustomParameterUrl = (subScribe) => {
    return `https://www.youtube.com/${subScribe}/videos`;
}

const youtubeCallBack = async(url) => {
    const browser = await puppeteer.launch({
      headless: false
    });
  
    const page = await browser.newPage();
    await page.setViewport({
      width: 10000,
      height: 10000
    });

    await page.goto(url);

    const content = await page.content();
    const $ = cheerio.load(content);
    const lists = $('.style-scope ytd-video-meta-block span');
    const titleAndUrlList = $('.style-scope ytd-rich-grid-media h3 a');
    const thumbnailList = $('#thumbnail');
  
    let size;
    if(thumbnailList.length<30) {
        size=thumbnailList.length;
    } else {
        size=30;
    }
    for(let i=0;i<size;i++) {
        crawingData.push({
            title:titleAndUrlList[i].attribs.title,
            url:titleAndUrlList[i].attribs.href,
            imageUrl:thumbnailList[i+1].children[1].children[0].attribs.src,
            date:await commonFunc.convertTextToDt(lists[(i*2)+1].children[0].data,new Date())
        })
    }
    browser.close();
    return crawingData;
};

module.exports = router;