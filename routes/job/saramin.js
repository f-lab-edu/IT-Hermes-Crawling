const commonFunc = require('../../common');
let request = commonFunc.request;
let cheerio = commonFunc.cheerio;

const express = commonFunc.express;
const router = express.Router();

// 크롤링한 데이터
let crawingData=[]; 
const defaultUrl = "https://www.saramin.co.kr";
/* response Data 
1. 제목
2. 채용공고명
3. 장소기준
4. 채용시작일자(없을 시, 현재 일자)
5. 채용종료일자(없을 시, 상시채용으로 99991231 기입)
*/

/* 사람인 데이터 조회 */
router.get('/', (req, res, next) => {
    /* DB에서 가져오는 데이터
    1. 경력
    2. 마지막 조회 sequence
    (예외) 사람인의 경우 IT를 디폴트 파라미터로 넣을 계획
    (미완료) 디비 연동 후 로직 추가 계획
    */
    let headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
    };
    let options = {
        url: 'https://www.saramin.co.kr/zf_user/jobs/public/list?sort=ud&quick_apply=&show_applied=&search_day=&keyword=&pr_exp_lv%5B%5D=2&loc_mcd%5B%5D=101000&final_edu%5B%5D=3&up_cd%5B%5D=3',
        headers: headers
    };
    request(options, saraminCallback);
    res.json(crawingData);
});

/* 조회 후, 응답 데이터 콜백함수 */
const saraminCallback = (error, response, body) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(body);
        let data = $('.str_tit');
        let loc = $('.work_place').toArray();
        let date = $('.deadlines').toArray();
        let company = [];
        let title = [];
        let url = [];
        let location = [];
        let dates = [];
        let index=0;

        for(let i=0;i<data.length;i++) {
            if(i%2==0) company.push(data[i].attribs.title);
            else {
                index++;
                title.push(data[i].attribs.title);
                url.push(data[i].attribs.href);
            }
        }
        loc.map(page => {
            location.push($(page).text());
        });
        date.map(page => {
            dates.push($(page).text());
        });
        for(let i=0;i<company.length;i++) {
            crawingData.push({
                company:company[i],
                title:title[i],
                url:defaultUrl+url[i],
                location:location[i],
                startDate:commonFunc.todayDate(),
                endDate:convertEndDate(dates[i])
            })
        }
    }
}

/* 일자 데이터 변환 함수 */
const convertEndDate = (endText) => {
    let endDate;
    if(endText=="오늘마감") {
        endDate=commonFunc.todayDate();
    } else if(endText=="내일마감") {
        endDate=commonFunc.tomorrowDate();
    } else {
        endDate=endText.substring(0,endText.length-3).replace('~ ','').split('/');
        endDate=commonFunc.customCurrentYearMonthAndDay(endDate[0],endDate[1]);
    }
    return endDate;
}

module.exports = router;