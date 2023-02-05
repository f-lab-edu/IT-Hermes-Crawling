const commonFunc = require('../../common');

const axios = commonFunc.axios;
const cheerio = commonFunc.cheerio;
const iconv = require('iconv-lite');
const express = commonFunc.express;
const router = express.Router();

let crawlingData = [];
let lastUrl;
let requestInfo = {
    url: `https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=105&sid2=283`,
    responseType: "arraybuffer"
};

router.get('/',(req,res,next)=>{
    lastUrl = req.query.url;

    axios(requestInfo)
    .then((response)=>{ 
        res.json(naverNewsCallback(response.data));
    })
    .catch((error)=>{
        res.json(error);
    })

})

const naverNewsCallback = (body)=>{
        const entireData = iconv.decode(body,"EUC-KR").toString();
        const $ = cheerio.load(entireData);

        let originalContentData = $('.lede').toArray();
        let originalData = $('.photo a img');
        let originalUrlData = $('.photo a');
        let originalDateData1 = $('.date.is_new').toArray();
        let originalDateData2 = $('.date.is_outdated').toArray();

        let title = [];
        let image = [];
        let content = [];
        let url = [];
        let dates = [];

        originalDateData1.map(element => {
            dates.push($(element).text());
        });

        originalDateData2.map(element => {
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

        for(let i=0; i<20; i++){
            if(lastUrl==url[i]){
                break;
            }
            crawlingData.push({
                title:title[i],
                description:content[i],
                thumbnail:image[i],
                url: url[i],
                date: commonFunc.convertTextToDt(dates[i])
            });
        }

        return crawlingData;
}

module.exports = router;
