const commonFunc = require('../../common');

const axios = commonFunc.axios;
const cheerio = commonFunc.cheerio;
const express = commonFunc.express;
const router = express.Router();

let crawlingData = [];

router.get('/',(req,res,error)=>{
    let page = req.query.page;

    let requestParam = {
        'country': 'kr',
        'tag_type_ids': '518',
        'locations':'all',
        'years': '-1',
        'limit':'20',
        'offset':`${page}`,
        'job_sort':'company.response_rate_order'
    };

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