export default function getDate(date){
    let hour=date.getHours()
    let minute=date.getMinutes()
    let second=date.getSeconds()
   
    return {
        hour,
        minute:minute.toString().length<2?'0'+minute:minute,
        second:second.toString().length<2?'0'+second:second
    }
}