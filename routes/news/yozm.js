const commonFunc = require('../../common');
const axios = commonFunc.axios;
let cheerio = commonFunc.cheerio;

const express = commonFunc.express;
const router = express.Router();
let lastUrl;
const defaultUrl = "https://yozm.wishket.com";
const queueName = 'YOZMQueue';
let globalChannel;
const amqp = commonFunc.mq;

router.get('/', (req,res,next) => {

    /** page 기준 정할 시, 동적으로 변환(메소드 사용 예정) */
    lastUrl = req.query.url;
    rabbitmqconnect();

    axios(requestYozmParameter())
         .then(response => res.json(responseYozmData(response.data)))
         .catch(error => res.json(error));
})

const requestYozmParameter = () => {
    return `https://yozm.wishket.com/magazine/list/develop/?page=1&q=`;
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
        if(defaultUrl+list[i].attribs.href==lastUrl) break;
        crawlingList.push({
            title:list[i].children[0].data,
            description: descriptList[i].children[0].data,
            thumbnail : defaultUrl+imageList[i].attribs.src,
            url:defaultUrl+list[i].attribs.href,
            date:newsDateList[i]
        })      
        globalChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(crawlingList[i])));      
    }
    return crawlingList;
}

const rabbitmqconnect = () => amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        channel.assertQueue(queueName, {
            durable: false
        });
        
        globalChannel=channel;
    });
});

module.exports = router;