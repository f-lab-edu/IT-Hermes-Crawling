const commonFunc = require('../../common');

const axios = commonFunc.axios;
const cheerio = commonFunc.cheerio;
const express = commonFunc.express;
const router = express.Router();

let crawlingData = [];
let lastUrl;

router.get('/',(req,res,error)=>{
    let job = req.query.job;
    let startExp = req.query.minExperience;
    let endExp = req.query.maxExperience;
    lastUrl = req.query.url;
    let startExpParam;
    let endExpParam;

    let developmentField1;
    let developmentField2;

    if(job=="BACKEND"){
        developmentField1=872;
        developmentField2=895;
    }else if(job=="FRONT"){
        developmentField1=669;
        developmentField2=669;
    }else{
        developmentField1=677;
        developmentField2=678;
    }

    if(startExp==0&&endExp==0){
        startExpParam=0;
        endExpParam=0;
    }else if(startExp==1&&endExp==4){
        startExpParam=1;
        endExpParam=4;
    }else if(startExp==5&&endExp==9){
        startExpParam=5;
        endExpParam=9;
    }else{
        startExpParam=10;
        endExpParam=10;
    }


    axios('https://www.wanted.co.kr/api/v4/jobs',{
        params: {
            'country': 'kr',
            'tag_type_ids': `${developmentField1}`,
            'tag_type_ids': `${developmentField2}`,
            'locations':'all',
            'years': `${startExpParam}`,
            'years': `${endExpParam}`,
            'limit':20,
            'offset':0,
            'job_sort':'company.response_rate_order'  
        }
    })
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

        for(let i=0; i<20; i++){
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

module.exports = router;