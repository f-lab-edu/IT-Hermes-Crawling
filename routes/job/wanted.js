const commonFunc = require('../../common');

const axios = commonFunc.axios;
const cheerio = commonFunc.cheerio;
const express = commonFunc.express;
const router = express.Router();

let crawlingData = [];
let lastUrl;

const queueName = 'wantedQueue';
let globalChannel;

router.get('/',(req,res,error)=>{
    let job = req.query.job;
    let startExp = req.query.minExperience;
    let endExp = req.query.maxExperience;
    lastUrl = req.query.url;

    let developmentField1;
    let developmentField2;

    if(job=="BACKEND"){
        developmentField1=872;
        developmentField2=895;
    }else if(job=="FRONT"){
        developmentField1=669;
        developmentField2=873;
    }else{
        developmentField1=677;
        developmentField2=678;
    }
    let requestParam = {};

    if(startExp==0&&endExp==0){
        requestParam = {
            'country': 'kr',
            'tag_type_ids': `${developmentField1}`,
            'tag_type_ids': `${developmentField2}`,
            'locations':'all',
            'years': '0',
            'limit':'20',
            'offset':'0',
            'job_sort':'company.response_rate_order'
        }
    }else if(startExp==1&&endExp==4){
        requestParam = {
            'country': 'kr',
            'tag_type_ids': `${developmentField1}`,
            'tag_type_ids': `${developmentField2}`,
            'locations':'all',
            'years': '1',
            'years': '4',
            'limit':'20',
            'offset':'0',
            'job_sort':'company.response_rate_order'
        }
    }else if(startExp==5&&endExp==9){
        requestParam = {
            'country': 'kr',
            'tag_type_ids': `${developmentField1}`,
            'tag_type_ids': `${developmentField2}`,
            'locations':'all',
            'years': '5',
            'years': '9',
            'limit':'20',
            'offset':'0',
            'job_sort':'company.response_rate_order'
        }
    }else{
        requestParam = {
            'country': 'kr',
            'tag_type_ids': `${developmentField1}`,
            'tag_type_ids': `${developmentField2}`,
            'locations':'all',
            'years': '10',
            'limit':'20',
            'offset':'0',
            'job_sort':'company.response_rate_order'
        }
    }

    axios('https://www.wanted.co.kr/api/v4/jobs',{
        params: requestParam})
    .then((response)=>{
        res.json(wantedCallback(response.data));
    })
    .catch((error)=>{
        res.json(error);
    })

})

const wantedCallback = (body)=>{
        let title = [];
        let companyTitle = [];
        let url = [];
        let location = [];
        let endDate = [];
        crawlingData = [];

        for(let i=0; i<body.data.length; i++){
            companyTitle.push(body.data[i].company.name);
            location.push(body.data[i].address.location);
            title.push(body.data[i].position);
            url.push('https://www.wanted.co.kr/'+'wd/'+body.data[i].id);
            endDate.push(body.data[i].due_time);
        }

        for(let i=0; i<body.data.length; i++){
            if(lastUrl==url[i]){
                break;
            }
            crawlingData.push({
                company: companyTitle[i],
                title: title[i],
                url:url[i],
                location: location[i],
                startDate: commonFunc.todayDate(),
                endDate: convertEndDate(endDate[i])
            });
        }

        return crawlingData;

}

const convertEndDate = (date) => {
    if(date == null){
        return "9999-12-31-00-00-00";
    }else{
        return date+"-00-00-00";
    }
};

var amqp = require('amqplib/callback_api');

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