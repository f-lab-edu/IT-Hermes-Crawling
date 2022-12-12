const today = new Date();

/* request 라이브러리 */
module.exports.request = require('request');
/* express 라이브러리 */
module.exports.express = require('express');
/* cheerio 라이브러리 */
module.exports.cheerio = require('cheerio');

/*  현재 일자(yyyymmdd) */
module.exports.todayDate= function() {
    return String(today.getFullYear())+String(today.getMonth()+1).padStart(2,'0')+String(('0' + today.getDate()).slice(-2));
}
/*  내일 일자(yyyymmdd) */
module.exports.tomorrowDate= function() {
    return String(today.getFullYear())+String(today.getMonth()+1).padStart(2,'0')+String(('0' + today.getDate()+1).slice(-2));
}
/*  현재 년도이지만, 달과 일 데이터는 외부에서 파라미터로 가져오는 일자함수(yyyymmdd) */
module.exports.customCurrentYearMonthAndDay= function(month, day) {
    return String(today.getFullYear())+String(month).padStart(2,'0')+String(day).padStart(2,'0')
}
/* custom 일시를 일자로(yyyymmdd) 변경 */
module.exports.convertCustomDate= function(date) {
    return String(date.getFullYear())+String(date.getMonth()+1).padStart(2,'0')+String(('0' + date.getDate()).slice(-2));
}

/* 인자 값이 존재하는 체크하는 함수 */
module.exports.isEmpty= function(text) {
    if(text == "" || text == undefined || text == null) {
        return true;
    } else {
        return false;
    }
}
/* 초,분,시간,일을 변환하는 함수 */
module.exports.convertTextToDt= function(text) {
    let stringText = String(text);
    let editDate;
    if(stringText.includes('초')) {
        let seconds = stringText.replace('초 전','');
        editDate = today.setSeconds(today.getSeconds()-Number(seconds));
    } else if(stringText.includes('분')) {
        let minutes = stringText.replace('분 전','');
        editDate = today.setMinutes(today.getMinutes()-Number(minutes));
    } else if(stringText.includes('시간')) {
        let hours = stringText.replace('시간 전','');
        editDate = today.setHours(today.getHours()-Number(hours));
    } else if(stringText.includes('일')) {
        let day = stringText.replace('일 전','');
        editDate = today.setDate(today.getDate()-Number(day));
    } else if(stringText.includes('달')) {
        let month = stringText.replace('달 전','');
        editDate = today.setMonth(today.getMonth()-month)
    } else if(stringText.includes('년')) {
        let year = stringText.replace('년 전','');
        editDate = today.setFullYear(today.getFullYear()-year)
    } else {
        return String(text).replaceAll('.','');
    }
    return this.convertCustomDate(new Date(editDate));
}