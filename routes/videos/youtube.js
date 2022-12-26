const commonFunc = require('../../common');
const axios = commonFunc.axios;
let cheerio = commonFunc.cheerio;

const express = commonFunc.express;
const router = express.Router();

/* 최근 크롤링한 날짜 혹은 shortenUrl */
let lastIndex;
/* 유튜버 정보 */
let youtuber;

const defaultUrl="https://www.youtube.com/watch?v=";

router.get('/', (req,res,next) => {
    /*  유튜버의 정보는 파라미터(유튜버, 마지막 순번)를 통해 전달 받을 계획 */
    youtuber = req.data;
    lastIndex = req.data;
    /* 임의로 데이터 삽입(추후 해당 크롤링 서버를 호출하는 곳에서 처리) */
    youtuber= "@dream-coding";
    lastIndex = "fJeGAx27-vU";
    axios(options(youtuber))
        .then(response => res.json(youtubeResponseData(parseYoutubeVideoList(response.data))))
        .catch(error => res.json(error));
    
});

const parseYoutubeVideoList = (body) => {
    const $ = cheerio.load(body);
    let entireData= $('script')[33].children[0].data;
    /** JSON 타입으로 변환하기 위해, 불필요한 데이터 제거 */
    entireData = String(entireData).slice(0,-1).substring(20,entireData.length);
    /** String to JSON */
    const jsonData = JSON.parse(entireData);
    /** video 정보 파싱 */
    const list = jsonData.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.richGridRenderer.contents;
    return list;
}

const options = (subScribe) => {
    return {
        method: 'GET',
        url: `https://www.youtube.com/${subScribe}/videos`
    };
}

const youtubeResponseData = (list) => {
    /** 최대 30개만 받아오게끔 처리 */
    const size = Math.min(30, list.length);
    let crawlingList = [];
    for(let i=0;i<size;i++) {
        const videoIdAndThumbnail = list[i].richItemRenderer.content.videoRenderer;
        crawlingList.push({
            title:videoIdAndThumbnail.title.runs[0].text,
            url:defaultUrl+videoIdAndThumbnail.videoId,
            youtuber:youtuber,
            thumbnail:videoIdAndThumbnail.thumbnail.thumbnails[0].url,
            date: commonFunc.convertTextToDt(videoIdAndThumbnail.publishedTimeText.simpleText)
        });            
    }
    return crawlingList;
}

module.exports = router;