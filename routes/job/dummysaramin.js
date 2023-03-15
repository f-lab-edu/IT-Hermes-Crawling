const commonFunc = require('../../common');
const axios = commonFunc.axios;
let cheerio = commonFunc.cheerio;

const express = commonFunc.express;
const router = express.Router();
let lastUrl;
const defaultUrl = 'https://www.saramin.co.kr';

router.get('/', (req, res, next) => {

    let page = req.query.page;
    axios(`https://www.saramin.co.kr/zf_user/jobs/list/job-category?page=${page}&cat_mcls=2&exp_cd=1%2C2&exp_none=y&search_optional_item=y&search_done=y&panel_count=y&preview=y&isAjaxRequest=0&page_count=50&sort=RL&type=job-category&is_param=1&isSearchResultEmpty=1&isSectionHome=0&searchParamCount=3#searchTitle`)
         .then(response => res.json(responseSaraminData(response.data)))
         .catch(error => res.json(error));
});

const responseSaraminData = (body) => {
    const $ = cheerio.load(body);
    //title
    let titleList = $(".job_tit a");
    //url , company
    let urlAndCompanyList = $(".company_nm a");
    //location
    let locationList = $(".company_info .work_place");
    //endDate
    let endDateList = $(".support_info .deadlines");

    let crawlingList=[];
    for(let i=0;i<titleList.length;i++) {
        if(lastUrl==defaultUrl+urlAndCompanyList[i].attribs.href) break;
        crawlingList.push({
            company:urlAndCompanyList[i].attribs.title,
            title:titleList[i].attribs.title,
            url:defaultUrl+urlAndCompanyList[i].attribs.href,
            location:locationList[i].children[0].data,
            startDate:commonFunc.todayDate(),
            endDate:convertEndDate(endDateList[i].children[0].data),
            crawlingIndex:i
        })
    }
    return crawlingList; 
}

/* 일자 데이터 변환 함수 */
const convertEndDate = (endText) => {
    let endDate;
    if(endText=="오늘마감" || endText==undefined) {
        endDate=commonFunc.todayDate();
    } else if(endText=="내일마감") {
        endDate=commonFunc.tomorrowDate();
    } else if(endText=="상시채용" || endText=="채용시") {
        endDate="9999-12-31-00-00-00";
    } else {
        endDate=endText.substring(0,endText.length-3).replace('~ ','').split('/');
        endDate=commonFunc.customCurrentYearMonthAndDay(endDate[0],endDate[1]);
    }
    return endDate;
}

module.exports = router;