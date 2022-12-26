const commonFunc = require('../../common');
const axios = commonFunc.axios;
let cheerio = commonFunc.cheerio;

const express = commonFunc.express;
const router = express.Router();

/* response Data 
1. 제목
2. 채용공고명
3. 장소기준
4. 채용시작일자(없을 시, 현재 일자)
5. 채용종료일자(없을 시, 상시채용으로 99991231 기입)
*/

/* 사람인 데이터 조회 */
router.get('/', (req, res, next) => {
    /** DB에서 가져오는 데이터
    1. 경력
    2. 마지막 조회 sequence or title
    3. 직무정보 가져오기(프론트,백엔드,모바일) 리스트형태로 받는다고 가정
    */
    /** isCheckExp(경력여부) : 신입일 땐 '1' 경력 + 신입 시 '1%2C2', 경력 시 '2' */
    /** startExp(경력시작년차) : 포함 시 'y' 안할 시 '' */
    /** endExp(경력종료년차) : 백엔드(84) 모바일(86) 프론트(87) 모두 선택 시 '%2C를 가운데에 삽입 */
    /** isCheckNonExp(경력무관 처리) : 포함 시 'y' 안할 시 '' */
    let developmentField="87";
    let startExp="1";
    let endExp="7";
    let isCheckExp="2";
    let isCheckNonExp="";
    /** 맨 처음 데이터를 가져올 때, 어느정도까지 데이터를 가져올지 기준 설정 필요! */
    let page="1";
    axios('https://www.saramin.co.kr/zf_user/jobs/list/job-category'
    ,{params: requestSaraminParameter(page,developmentField,isCheckExp,startExp,endExp,isCheckNonExp)})
         .then(response => res.json(responseSaraminData(response.data)))
         .catch(error => res.json(error));
});
const requestSaraminParameter = (page, developmentField, isCheckExp, startExp, endExp, isCheckNonExp) => {
    return {
        'page': `${page}`,
        'cat_kewd': `${developmentField}`,
        'edu_min': '8',
        'edu_max': '11',
        'exp_min':`${startExp}`,
        'exp_cd':`${isCheckExp}`,
        'exp_min':`${endExp}`,
        'exp_none':`${isCheckNonExp}`
    }
}
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
        crawlingList.push({
            company:urlAndCompanyList[i].attribs.title,
            title:titleList[i].attribs.title,
            url:urlAndCompanyList[i].attribs.href,
            location:locationList[i].children[0].data,
            startDate:commonFunc.todayDate(),
            endDate:convertEndDate(endDateList[i].children[0].data)
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
        endDate="99991231";
    } else {
        endDate=endText.substring(0,endText.length-3).replace('~ ','').split('/');
        endDate=commonFunc.customCurrentYearMonthAndDay(endDate[0],endDate[1]);
    }
    return endDate;
}

module.exports = router;