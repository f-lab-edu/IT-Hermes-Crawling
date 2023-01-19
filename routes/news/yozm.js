const commonFunc = require('../../common');
const axios = commonFunc.axios;
let cheerio = commonFunc.cheerio;

const express = commonFunc.express;
const router = express.Router();


router.get('/', (req,res,next) => {

    /** page 기준 정할 시, 동적으로 변환(메소드 사용 예정) */
    let page = "1";
    axios(requestYozmParameter(page))
         .then(response => res.json(responseYozmData(response.data)))
         .catch(error => res.json(error));
})

const requestYozmParameter = (page) => {
    return `https://yozm.wishket.com/magazine/list/develop/?page=${page}&q=`;
}

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
            description: descriptList[i].children[0].data,
            thumbnail : imageList[i].attribs.src,
            url:list[i].attribs.href,
            date:newsDateList[i]
        })            
    }
    return crawlingList;
}

module.exports = router;