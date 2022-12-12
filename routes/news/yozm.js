const commonFunc = require('../../common');
let request = commonFunc.request;
let cheerio = commonFunc.cheerio;

const express = commonFunc.express;
const router = express.Router();

let crawlingData = [];

const options = {
    url: 'https://yozm.wishket.com/magazine/list/develop/',
};

router.get('/',function(req,res,next){
    request(options,yozmCallback);
    res.json(crawlingData);
})

function yozmCallback(error, response, body){
    if(!error && response.statusCode == 200){
        const $ = cheerio.load(body);
        let main = $('.item-main');
        let list = main.find('.item-title');
        let time = main.find('.content-meta-elem');
        let descriptList = main.find('.item-description');
        let imageList = $('.item-thumbnail-pc a img');
        let newsDateList = [];
        for(let i=0;i<time.length;i++) {
            let childData = time[i].children[0];
            if(!commonFunc.isEmpty(childData)) {
                if(String(childData.data).includes('전') || String(childData.data).includes('.')) {
                    newsDateList.push(commonFunc.convertTextToDt(childData.data));
                }
            }
        }
        for(let i=0;i<list.length;i++) {
            crawlingData.push({
                title:list[i].children[0].data,
                url:list[i].attribs.href,
                descript: descriptList[i].children[0].data,
                imageUrl : imageList[i].attribs.src,
                newsDate:newsDateList[i]
            })            
        }
    }
}

module.exports = router;