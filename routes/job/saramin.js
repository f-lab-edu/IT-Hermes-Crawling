const commonFunc = require('../../common');
const axios = commonFunc.axios;
let cheerio = commonFunc.cheerio;

const express = commonFunc.express;
const router = express.Router();
let lastUrl;
const defaultUrl = 'https://www.saramin.co.kr';
const amqp = commonFunc.mq;

const queueName = 'SARAMINQueue';
let globalChannel;
let grade;
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
    /** startExp(경력시작년차)*/
    /** endExp(경력종료년차) */
    /** cat_kewd(직무) : 백엔드(84) 모바일(86) 프론트(92)) */
    /** isCheckNonExp(경력무관 처리) : 포함 시 'y' 안할 시 '' */
    rabbitmqconnect();
    let job=req.query.job;
    grade=req.query.grade;
    let startExp=req.query.minExperience;
    let endExp=req.query.maxExperience;
    lastUrl=req.query.url;
    let developmentField;
    if(job=="BACKEND") {
        developmentField=84;
    } else if(job=="MOBILE") {
        developmentField=86;
    } else {
        developmentField=92
    }
    /** 맨 처음 데이터를 가져올 때, 어느정도까지 데이터를 가져올지 기준 설정 필요! */
    axios('https://www.saramin.co.kr/zf_user/jobs/list/job-category'
    ,{params: requestSaraminParameter(developmentField,startExp,endExp)})
         .then(response => res.json(responseSaraminData(response.data)))
         .catch(error => res.json(error));
});
const requestSaraminParameter = (developmentField, startExp, endExp) => {
    return {
        'cat_kewd': `${developmentField}`,
        'edu_min': '8',
        'edu_max': '11',
        'exp_min':`${startExp}`,
        'exp_max':`${endExp}`
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
        if(lastUrl==defaultUrl+urlAndCompanyList[i].attribs.href) break;
        crawlingList.push({
            company:urlAndCompanyList[i].attribs.title,
            title:titleList[i].attribs.title,
            url:defaultUrl+urlAndCompanyList[i].attribs.href,
            location:locationList[i].children[0].data,
            job: job,
            grade : grade,
            startDate:commonFunc.todayDate(),
            endDate:convertEndDate(endDateList[i].children[0].data)
        })
    }

    globalChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(crawlingList)));
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