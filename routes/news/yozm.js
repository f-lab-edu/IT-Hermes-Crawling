const commonFunc = require('../../common');
const axios = commonFunc.axios;
let cheerio = commonFunc.cheerio;

const express = commonFunc.express;
const router = express.Router();

const options = {
    url: 'https://yozm.wishket.com/magazine/list/develop/',
};

router.get('/', (req,res,next) => {
    axios(options.url)
         .then(response => res.json(responseYozmData(response.data)))
         .catch(error => res.text(new Error(error)));
})

const responseYozmData = (body) => {
    const $ = cheerio.load(body);
    let main = $('.item-main');
    let list = main.find('.item-title');
    let time = main.find('.content-meta-elem');
    let descriptList = main.find('.item-description');
    let imageList = $('.item-thumbnail-pc a img');
    let newsDateList = [];
    let crawlingList=[];
    for(let i=0;i<time.length;i++) {
        let childData = time[i].children[0];
        if(!commonFunc.isEmpty(childData)) {
            if(String(childData.data).includes('전') || String(childData.data).includes('.')) {
                newsDateList.push(commonFunc.convertTextToDt(childData.data));
            }
        }
    }
    for(let i=0;i<list.length;i++) {
        crawlingList.push({
            title:list[i].children[0].data,
            url:list[i].attribs.href,
            descript: descriptList[i].children[0].data,
            thumbnail : imageList[i].attribs.src,
            date:newsDateList[i]
        })            
    }
    return crawlingList;
}

module.exports = router;