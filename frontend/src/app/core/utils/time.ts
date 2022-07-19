export class time {

  public static getCurrentTime() {
    let dateTime = new Date();
    let min = dateTime.getMinutes();
    let hour = dateTime.getHours();
    if (min <10){

      return "" + hour + ":0" + min;
    }else{
      return "" + hour + ":" + min;

    }
  }
}
