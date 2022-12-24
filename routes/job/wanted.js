const { json } = require('express');
const commonFunc = require('../../common');
const request = commonFunc.request;
const cheerio = commonFunc.cheerio;

const express = commonFunc.express;
const router = express.Router();


let crawlingData = [];
let header = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Referer': 'https://www.wanted.co.kr/'
};
let requestInfo = {
    url: 'https://www.wanted.co.kr/api/v4/jobs?1671869983005&country=kr&tag_type_ids=873&tag_type_ids=872&tag_type_ids=678&tag_type_ids=895&tag_type_ids=669&job_sort=company.response_rate_order&locations=all&years=-1',
    headers: header
};

router.get('/',(req,res,error)=>{
    doRequest(requestInfo)
        .then((value)=>wantedCallback(value))
        .then(()=>{res.json(crawlingData)})
        .catch(error=>{res.json(error)});
})

function doRequest(requestInfo){
    return new Promise((resolve,reject)=>{
        request(requestInfo,(error,response,body)=>{
            if(!error&&response.statusCode==200){
                resolve(body);
            }else{
                reject(error);
            }
        })
    })
}


const wantedCallback = (body)=>{
        body = JSON.parse(body);

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
            url.push('/wd/'+body.data[i].id);
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

}

module.exports = router;