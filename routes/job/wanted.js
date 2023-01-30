const commonFunc = require('../../common');

const axios = commonFunc.axios;
const cheerio = commonFunc.cheerio;
const express = commonFunc.express;
const router = express.Router();

let crawlingData = [];

let requestInfo = {
    url: 'https://www.wanted.co.kr/api/v4/jobs?1671869983005&country=kr&tag_type_ids=873&tag_type_ids=872&tag_type_ids=678&tag_type_ids=895&tag_type_ids=669&job_sort=company.response_rate_order&locations=all&years=-1'
};

router.get('/',(req,res,error)=>{

    axios(requestInfo)
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
        let image = [];
        let url = [];
        let location = [];

        for(let i=0; i<body.data.length; i++){
            companyTitle.push(body.data[i].company.name);
            image.push(body.data[i].title_img.thumb);
            location.push(body.data[i].address.location);
            title.push(body.data[i].position);
            url.push('https://www.wanted.co.kr/'+'wd/'+body.data[i].id);
        }


        for(let i=0; i<20; i++){
            crawlingData.push({
                title: title[i],
                company: companyTitle[i],
                thumbnail: image[i],
                location: location[i],
                url:url[i]
            });
        }
        return crawlingData;

}

module.exports = router;