const commonFunc = require('../../common');

const axios = commonFunc.axios;
const cheerio = commonFunc.cheerio;
const express = commonFunc.express;
const router = express.Router();

let crawlingData = [];

router.get('/',(req,res,error)=>{
    let job = req.query.job;
    let startExp = req.query.minExperience;
    let endExp = req.query.maxExperience;
    let lastUrl;

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

    axios('https://www.wanted.co.kr/api/v4/jobs',{
        params: {
            'country': 'kr',
            'tag_type_ids': `${developmentField1}`,
            'tag_type_ids': `${developmentField2}`,
            'locations':'all',
            'years': `${startExp}`,
            'years': `${endExp}`,
            'limit':20,
            'offset':20,
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
                endDate: convertEndDate(endDate[i])
            });
        }
        return crawlingData;

}

const convertEndDate = (date) => {
    if(date == null){
        return commonFunc.todayDate();
    }else{
        return date+"-00-00-00";
    }
};

module.exports = router;