const commonFunc = require('../../common');

const axios = commonFunc.axios;
const cheerio = commonFunc.cheerio;
const express = commonFunc.express;
const router = express.Router();
const amqp = commonFunc.mq;

const queueName = 'CODINGWORLDQueue';
let globalChannel;
const defaultUrl="https://www.codingworldnews.com";
let lastUrl;
let requestInfo = {
    url: "https://www.codingworldnews.com/news/articleList.html?sc_section_code=S1N2&view_type=sm"
};

router.get('/',(req,res,next) => {
    lastUrl = req.query.url;

    rabbitmqconnect();

    axios(requestInfo)
    .then((response)=>{
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

        let crawlingData = [];
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

        for(let i=0; i<20; i++){
            if(lastUrl==defaultUrl+url[i]){
                break;
            }
            crawlingData.push({
                title: title[i],
                description: content[i],
                thumbnail: image[i],
                url: defaultUrl+url[i],
                date: dates[i]
            });
            console.log(crawlingData[i]);
        }
        globalChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(crawlingData)));
        return crawlingData;
}

const convertDate = (originalDate) => {
    if(originalDate==null){
        return commonFunc.todayDate();
    }else{
        let changedDate='';
    
        changedDate+=originalDate.substring(0,4);
        changedDate+="-";
        changedDate+=originalDate.substring(5,7);
        changedDate+='-';
        changedDate+=originalDate.substring(8,10);
        changedDate+='-';
        changedDate+=originalDate.substring(11,13);
        changedDate+='-';
        changedDate+=originalDate.substring(14,16);
        changedDate+='-';
        changedDate+='00';
    
        return changedDate;
    }
};

const rabbitmqconnect = () => amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        channel.assertQueue(queueName, {
            durable: true
        });
        
        globalChannel=channel;
    });
});

module.exports = router;