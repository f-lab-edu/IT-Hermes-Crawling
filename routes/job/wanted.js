const express = require('express');
const router = express.Router();

const commonFunc = require('../../common');
const request = require('request');
const cheerio = require('cheerio');
const { registerCustomQueryHandler } = require('puppeteer');

let crawlingData = [];

router.get('/',function(req,res,error){
    let header = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    };
    let requestInfo = {
        url: 'https://www.wanted.co.kr/wdlist/518?country=kr&job_sort=company.response_rate_order&years=-1&selected=873&selected=872&selected=669&selected=677&selected=678&locations=all',
        headers: header
    };
    request(requestInfo,wantedCallback);
    res.json(crawlingData);
})


function wantedCallback(error,response,body){
    if(!error && response.statusCode == 200){
        const $ = cheerio.load(body);

        let originalData = $('.Card_className__u5rsb a').toArray();
        let originalCompanyData = $('.job-card-company-name').toArray();
        let originalLocationData = $('.job-card-company-location').toArray();
        let originalTitleData = $('.job-card-position').toArray();
        let originalImageData = $('.Card_className__u5rsb header').toArray();

        let title = [];
        let companyTitle = [];
        let image = [];
        let url = [];
        let location = [];

        for(let i=0; i<originalData.length; i++){
            url.push(originalData[i].attribs.href);
        }

        for(let i=0; i<originalImageData.length; i++){
            image.push(originalImageData[i].attribs.style);
        }

        originalCompanyData.map(element => {
            companyTitle.push($(element).text());
        })

        originalLocationData.map(element=>{
            location.push($(element).text());
        })
        
        originalTitleData.map(element=>{
            title.push($(element).text());
        })

        for(let i=0; i<20; i++){
            crawlingData.push({
                title: title[i],
                companyTitle: companyTitle[i],
                image: image[i],
                location: location[i],
                url:url[i]
            });
        }
    }

}

module.exports = router;