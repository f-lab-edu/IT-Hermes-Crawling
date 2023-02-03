const commonFunc = require('../../common');

const axios = commonFunc.axios;
const cheerio = commonFunc.cheerio;
const express = commonFunc.express;
const router = express.Router();

let crawlingData = [];

let requestInfo = {
    url: 'https://www.wanted.co.kr/api/v4/jobs'
};

router.get('/',(req,res,error)=>{
    let job = req.query.job;

    let startExp = req.query.minExperience;
    let endExp = req.query.maxExperience;
    let developmentField1;
    let developmentField2;

    if(job=="BACKEND"){
        developmentField1=872;
        developmentField2=895;
    }else if(job=="FRONTEND"){
        developmentField1=669;
        developmentField2=669;
    }else{
        developmentField1=677;
        developmentField2=678;
    }

    axios(requestInfo,customParams(developmentField1,developmentField2,startExp,endExp))
    .then((response)=>{
        res.json(wantedCallback(response.data));
    })
    .catch((error)=>{
        res.json(error);
    })

})

const customParams = (param1,param2,param3,param4) => {
    return {
        'county': 'kr',
        'tag_type_ids': `${param1}`,
        'tag_type_ids': `${param2}`,
        'locations':'all',
        'years': `${param3}`,
        'years': `${param4}`,
        'limit':'20',
        'offset':'20',
        'job_sort':'company.response_rate_order'
    }
};

const wantedCallback = (body)=>{

        let title = [];
        let companyTitle = [];
        let url = [];
        let location = [];
        let endDate = [];

        for(let i=0; i<body.data.length; i++){
            companyTitle.push(body.data[i].company.name);
            location.push(body.data[i].address.location);
            title.push(body.data[i].position);
            url.push('https://www.wanted.co.kr/'+'wd/'+body.data[i].id);
            endDate.push(body.data[i].due_time);
        }


        for(let i=0; i<20; i++){
            crawlingData.push({
                company: companyTitle[i],
                title: title[i],
                url:url[i],
                location: location[i],
                startDate: commonFunc.todayDate(),
                endDate: endDate[i]
            });
        }
        return crawlingData;

}

module.exports = router;