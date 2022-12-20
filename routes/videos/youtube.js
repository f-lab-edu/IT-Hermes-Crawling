const commonFunc = require('../../common');
let request = commonFunc.request;
let cheerio = commonFunc.cheerio;

const express = commonFunc.express;
const router = express.Router();

let crawlingData = [];
/* 최근 크롤링한 날짜 혹은 shortenUrl */
let lastIndex;
/* 유튜버 정보 */
let youtuber;

const defaultUrl="https://www.youtube.com/watch?v=";

router.get('/', (req,res,next) => {
    console.time('check');
    /*  유튜버의 정보는 파라미터(유튜버, 마지막 순번)를 통해 전달 받을 계획 */
    youtuber = req.data;
    lastIndex = req.data;
    /* 임의로 데이터 삽입(추후 해당 크롤링 서버를 호출하는 곳에서 처리) */
    youtuber= "@dream-coding";
    lastIndex = "fJeGAx27-vU";

    request(insertCustomParameterUrl(youtuber), youtubeCallback);
    res.json(crawlingData);
    console.timeEnd('check');
});

const insertCustomParameterUrl = (subScribe) => {
    return {
        url: `https://www.youtube.com/${subScribe}/videos`
    };
}

const youtubeCallback = (error, response, body) => {
    if(!error && response.statusCode == 200){
        const $ = cheerio.load(body);
        let entireData= $('script')[33].children[0].data;
        /** JSON 타입으로 변환하기 위해, 불필요한 데이터 제거 */
        entireData = String(entireData).slice(0,-1).substring(20,entireData.length);
        /** String to JSON */
        const jsonData = JSON.parse(entireData);
        /** video 정보 파싱 */
        const list = jsonData.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.richGridRenderer.contents;
        /** 최대 30개만 받아오게끔 처리 */
        let size;
        if(list.length<=30) {
            size=list.length;
        } else {
            size=30;
        }
        insertData(size,list);
    }
}

const insertData = (size,list) => {
    for(let i=0;i<size;i++) {
        const videoIdAndThumbnail = list[i].richItemRenderer.content.videoRenderer;
        crawlingData.push({
            title:videoIdAndThumbnail.title.runs[0].text,
            url:defaultUrl+videoIdAndThumbnail.videoId,
            youtuber:youtuber,
            thumbnail:videoIdAndThumbnail.thumbnail.thumbnails[0].url,
            date: commonFunc.convertTextToDt(videoIdAndThumbnail.publishedTimeText.simpleText)
        });            
    }
}

module.exports = router;