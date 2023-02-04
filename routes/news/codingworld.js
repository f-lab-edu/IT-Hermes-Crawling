const commonFunc = require('../../common');

const axios = commonFunc.axios;
const cheerio = commonFunc.cheerio;
const express = commonFunc.express;
const router = express.Router();

let crawlingData = [];
let lastUrl;
let requestInfo = {
    url: "https://www.codingworldnews.com/news/articleList.html?sc_section_code=S1N2&view_type=sm"
};

router.get('/',(req,res,next) => {
    lastUrl = req.query.url;

    axios(requestInfo)
    .then((response)=>{
        console.log(lastUrl);
        res.json(codingworldNewsCallback(response.data));
    })
    .catch((error)=>{
        res.json(error);
    })

})


const codingworldNewsCallback = (body)=>{
        const $ = cheerio.load(body);

        let originalData = $('.titles a').toArray();
        let originalDateData = $('span em:nth-child(3)').toArray();
        let originalImageData = $('.type2 img');
        let originalContentData = $('.lead.line-6x2 a').toArray();

        let title = [];
        let image = [];
        let dates = [];
        let content = [];
        let url = [];

        originalData.map(element => {
            title.push($(element).text());
        });

        originalDateData.map(element => {
            dates.push(convertDate($(element).text()));
        })

        for(let i=0; i<originalData.length; i++){
            url.push(originalData[i].attribs.href);
        }

        for(let i=0; i<originalImageData.length; i++){
            image.push(originalImageData[i].attribs.src);
        }
        
        originalContentData.map(element => {
            let title = $(element).text();
            title = title.replace(/[\t\n]/g,'');
            title = title.trim();
            content.push(title);
        })

        for(let i=0; i<originalDateData.length-1; i++){
            if(lastUrl==url[i]){
                break;
            }
            crawlingData.push({
                title: title[i],
                date: dates[i],
                url: 'https://www.codingworldnews.com'+url[i],
                thumbnail: image[i],
                descript: content[i]
            });
        }
        return crawlingData;
}

const convertDate = (originalDate) => {
    let changedDate;
    let base = originalDate.substring(0,10);
    changedDate = base.replace(".","");
    changedDate = changedDate.replace(".","");
    return changedDate;
};

module.exports = router;