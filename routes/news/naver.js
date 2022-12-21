const express = require('express');
const router = express.Router();

const commonFunc = require('../../common');
let request = require('request');
let cheerio = require('cheerio');
let iconv = require('iconv-lite');

let crawlingData = [];

router.get('/',function(req,res,next){
    let requestInfo = {
        url: "https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=105&sid2=283",
        encoding: null
    };
    request(requestInfo,naverNewsCallback);
    res.json(crawlingData);
})

function naverNewsCallback(error, response, body){
    if(!error && response.statusCode == 200){
        const entireData = iconv.decode(body,"EUC-KR").toString();
        const $ = cheerio.load(entireData);

        let originalContentData = $('.lede').toArray();
        let originalData = $('.photo a img');
        let originalUrlData = $('.photo a');
        let originalDateData = $('.date.is_outdated').toArray();

        let title = [];
        let image = [];
        let content = [];
        let url = [];
        let dates = [];

        originalDateData.map(element => {
            dates.push($(element).text());
        });
    
        originalContentData.map(element => {
            content.push($(element).text());
        });
    
        for(let i=0; i<originalData.length; i++){
            image.push(originalData[i].attribs.src);
            title.push(originalData[i].attribs.alt);
        }

        for(let i=0; i<originalUrlData.length; i++){
            url.push(originalUrlData[i].attribs.href);
        }

        for(let j=0; j<originalData.length; j++){
            crawlingData.push({
                title:title[j],
                descript:content[j],
                thumbnail:image[j],
                url: url[j],
                date: convertDate(dates[j])
            });
        }

    }
}

const convertDate = (originalDate) => {
    originalDate = originalDate.replace(/\t/,'');
    let changedDate;
    
    if(originalDate[originalDate.length-1]=='전'){
        let base = originalDate.replace(/[0-9]/g,"");
        if(base=="시간전" || base=="분전"){
            changedDate = commonFunc.todayDate();
        }else{
            let num = originalDate[0];
            const today = new Date();
           changedDate = commonFunc.customCurrentYearMonthAndDay(today.getMonth()+1,today.getDate()-num);
        }
    }else{
        let date = originalDate.substring(0,10);
        date = date.replace(".","");
        date = date.replace(".","");
        changedDate = date;
    }
    return changedDate;
};

module.exports = router;
