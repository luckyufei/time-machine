import { REG_HOUR_TIME } from '../util/constant';

export default class StatTime {
  constructor(...args) {
    if (args.length === 2) {
      this.hour = args[0];
      this.minute = args[1];
    } else if (args.length === 0) {
      this.hour = 0;
      this.minute = 0;
    } else {
      const time = args[0];
      const [, hour, minute] = time.match(REG_HOUR_TIME);
      this.hour = hour ? parseInt(hour) : 0;
      this.minute = minute ? parseInt(minute) : 0;
      this.carryPossible();
    }
  }

  get minutes() {
    return (this.hour * 60) + this.minute;
  }

  add(another) {
    this.hour += another.hour;
    this.minute += another.minute;
    this.carryPossible();
    return this;
  }

  percent(another) {
    return `${Math.floor((another.minutes * 100) / this.minutes)}%`;
  }

  carryPossible() {
    if (this.minute > 60) {
      const _hour = Math.floor(this.minute / 60);
      const _minute = this.minute % 60;

      this.hour += _hour;
      this.minute = _minute;
    }
  }

  toString() {
    const str = [];
    if (this.hour > 0) str.push(`${this.hour}小时`);
    if (this.minute > 0) str.push(`${this.minute}分`);
    return str.join('');
  }
}
