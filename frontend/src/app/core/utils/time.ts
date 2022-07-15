export class time {

  public static getCurrentTime() {
    let dateTime = new Date();
    let min = dateTime.getMinutes();
    let hour = dateTime.getHours();
    return "" + hour + ":" + min;
  }
}