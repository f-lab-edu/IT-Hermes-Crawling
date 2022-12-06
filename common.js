const today = new Date();  
/*  현재 일자(yyyymmdd) */
module.exports.todayDate= function() {
    return String(today.getFullYear())+String(today.getMonth()+1).padStart(2,'0')+String(today.getDay()).padStart(2,'0');
}
/*  내일 일자(yyyymmdd) */
module.exports.tomorrowDate= function() {
    return String(today.getFullYear())+String(today.getMonth()+1).padStart(2,'0')+String(today.getDay()+1).padStart(2,'0');
}
/*  현재 년도이지만, 달과 일 데이터는 외부에서 파라미터로 가져오는 일자함수(yyyymmdd) */
module.exports.customCurrentYearMonthAndDay= function(month, day) {
    return String(today.getFullYear())+String(month).padStart(2,'0')+String(day).padStart(2,'0')
}