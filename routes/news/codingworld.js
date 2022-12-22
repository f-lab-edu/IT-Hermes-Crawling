const commonFunc = require('../../common');
const request = commonFunc.request;
const cheerio = commonFunc.cheerio;

const express = commonFunc.express;
const router = express.Router();

let crawlingData = [];
let requestInfo = {
    url: "https://www.codingworldnews.com/news/articleList.html?sc_section_code=S1N2&view_type=sm"
};

router.get('/',(req,res,next) => {
    doRequest(requestInfo)
    .then((value)=>codingworldNewsCallback(value))
    .then(()=>{res.json(crawlingData)})
    .catch(error=>{res.json(error)});
})

function doRequest(requestInfo){
    return new Promise((resolve,reject)=>{
        request(requestInfo,(error,response,body)=>{
            if(!error&&response.statusCode==200){
                resolve(body);
            }else{
                reject(error);
            }
        })
    })
}


const codingworldNewsCallback = (body)=>{
        const $ = cheerio.load(body);

        let originalData = $('.titles a').toArray();
        let originalDateData = $('.byline').find('em:eq(2)').toArray();
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

        for(let i=0; i<originalData.length; i++){
            crawlingData.push({
                title: title[i],
                date: dates[i],
                url: url[i],
                thumbnail: image[i],
                descript: content[i]
            });
        }
}

const convertDate = (originalDate) => {
    let changedDate;
    let base = originalDate.substring(0,10);
    changedDate = base.replace(".","");
    changedDate = changedDate.replace(".","");
    return changedDate;
};

module.exports = router;