let today = new Date();

/* request 라이브러리 */
module.exports.request = require('request');
/* express 라이브러리 */
module.exports.express = require('express');
/* cheerio 라이브러리 */
module.exports.cheerio = require('cheerio');
/* puppeteer 라이브러리 */
module.exports.puppeteer = require('puppeteer');
/* axios 라이브러리 */
module.exports.axios = require('axios');

/*  현재 일자(yyyymmdd) */
module.exports.todayDate= function() {
    return String(today.getFullYear())+"-"+String(today.getMonth()+1).padStart(2,'0')+"-"+String(('0' + today.getDate()).slice(-2))+"-00-00-00";
}
/*  내일 일자(yyyymmdd) */
module.exports.tomorrowDate= function() {
    return String(today.getFullYear())+"-"+String(today.getMonth()+1).padStart(2,'0')+"-"+String(('0' + today.getDate()+1).slice(-2))+"-00-00-00";
}
/*  현재 년도이지만, 달과 일 데이터는 외부에서 파라미터로 가져오는 일자함수(yyyymmdd) */
module.exports.customCurrentYearMonthAndDay= function(month, day) {
    return String(today.getFullYear())+"-"+String(month).padStart(2,'0')+"-"+String(day).padStart(2,'0')+"-00-00-00";
}
/* custom 일시를 일자로(yyyy-MM-dd-HH-mm-ss) 변경 */
module.exports.convertCustomDate= function(date) {
    return String(date.getFullYear())+"-"+String(date.getMonth()+1).padStart(2,'0')+"-"+String(('0' + date.getDate()).slice(-2))
    +"-"+String(date.getHours()).padStart(2,'0')+"-"+String(date.getMinutes()).padStart(2,'0')+"-"+String(date.getSeconds()).padStart(2,'0');
}

/* 인자 값이 존재하는 체크하는 함수 */
module.exports.isEmpty= function(text) {
    if(text == "" || text == undefined || text == null) {
        return true;
    } else {
        return false;
    }
}

/* 현재시간을 반환하는 함수 */
module.exports.createNowDate=() => {
    return new Date();
}

/* 초,분,시간,일을 변환하는 함수 */
module.exports.convertTextToDt= function(text) {
    let stringText = String(text);
    if(stringText.includes('초')) {
        let seconds="";
        if(stringText.includes('초 전')){
            seconds = stringText.replace('초 전','');
        }else{
            seconds = stringText.replace('초전','');
        }
        editDate = today.setSeconds(today.getSeconds()-Number(seconds));
    } else if(stringText.includes('분')) {
        let minutes="";
        if(stringText.includes('분 전')){
            minutes = stringText.replace('분 전','');
        }else{
            minutes = stringText.replace('분전','');
        }
        editDate = today.setMinutes(today.getMinutes()-Number(minutes));
    } else if(stringText.includes('시간')) {
        let hours="";
        if(stringText.includes('시간 전')){
            hours = stringText.replace('시간 전','');
        }else{
            hours = stringText.replace('시간전','');
        }
        editDate = today.setHours(today.getHours()-Number(hours));
    } else if(stringText.includes('일')) {
        let day="";
        if(stringText.includes('일 전')){
            day = stringText.replace('일 전','');
        }else{
            day = stringText.replace('일전','');
        }
        editDate = today.setDate(today.getDate()-Number(day));
    } else if(stringText.includes('주')) {
        let day="";
        if(stringText.includes('주 전')){
            day = stringText.replace('주 전','');
        }else{
            day = stringText.replace('주전','');
        }
        editDate = today.setDate(today.getDate()-Number(day)*7);
    }  else if(stringText.includes('달') || stringText.includes('개월')) {
        let month="";
        month = stringText.replace('달전','').replace('달 전','').replace('개월 전','').replace('개월전','');

        editDate = today.setMonth(today.getMonth()-month);
    } else if(stringText.includes('년')) {
        let year="";
        if(stringText.includes('년 전')){
            year = stringText.replace('년 전','');
        }else{
            year = stringText.replace('년전','');
        }
        editDate = today.setFullYear(today.getFullYear()-year);
    } else {
        let editDate = String(text).split('.');
        return editDate[0]+"-"+editDate[1]+"-"+editDate[2]+"-"+"00-00-00";
    }
    today=new Date();
    return this.convertCustomDate(new Date(editDate));
}