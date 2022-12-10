const express = require('express');
const router = express.Router();

const commonFunc = require('../../common');
let request = require('request');
let cheerio = require('cheerio');
let iconv = require('iconv-lite');

let crawlingData = [];

/* response Data
1. 해당 글 사진
2. 해당 글 제목
3. 해당 글 본문 간략한 요약 글
4. 해당 글 작성 일자(20221212로 기입)
5. 해당 글 url
*/
router.get('/',function(req,res,next){
    let headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
    };
    let options = {
        url: "https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=105&sid2=283",
     //   headers: headers,
        encoding: null
    };
    request(options,naverNewsCallback);
    res.json(crawlingData);
})

function naverNewsCallback(error, response, body){
    if(!error && response.statusCode == 200){
        const entireData = iconv.decode(body,"EUC-KR").toString();
        const $ = cheerio.load(entireData);

        let contentData = $('.lede').toArray();
        let imageData = $('.photo a img');
        let urlData = $('.photo a');
        let dateData = $('.date is_outdated').toArray();

        let title = [];
        let image = [];
        let content = [];
        let url = [];
        let dates = [];

        dateData.map(page => {
            dates.push($(page).text());
        });
    
        contentData.map(page => {
            content.push($(page).text());
        });
    
        for(let i=0; i<imageData.length; i++){
            image.push(imageData[i].attribs.src);
            title.push(imageData[i].attribs.alt);
        }

        for(let i=0; i<urlData.length; i++){
            url.push(urlData[i].attribs.href);
        }

        for(let j=0; j<imageData.length; j++){
            crawlingData.push({
                title:title[j],
                content:content[j],
                image:image[j],
                url: url[j],
              // dates: convertDate(dates[i])
            });
        }

    }
}

const convertDate = (originalDate) => {
    let base = originalDate.substring(1,originalDate.length);
    let contentDate;

    if(base=="시간전"){
        contentDate = commonFunc.todayDate();
    }else if(base=="일전"){
       let num = originalDate[0];
        const today = new Date();
       contentDate = commonFunc.customCurrentYearMonthAndDay(today.getMonth()+1,today.getDate()+1-num);
    }else{
        let date = originalDate.substring(0,10);
        date = date.replace(".","");
        date = date.replace(".","");
        contentDate = date;
    }
    return contentDate;
};

module.exports = router;
