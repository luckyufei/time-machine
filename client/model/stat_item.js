import StatTime from './stat_time';

export default class StatItem {
  constructor(key, value) {
    this.key = key;
    this._origin = value;

    const times = value.split(',');
    if (times.length === 1) {
      this.statTime = new StatTime(times[0]);
    } else {
      const statTimes = times.map(time => new StatTime(time));
      this.statTime = statTimes.reduce((acc, item) => acc.add(item), new StatTime());
    }
  }

  get value() {
    return this.statTime.minutes;
  }

  get origin() {
    return this.statTime.toString();
  }

  toString() {
    return `{key: ${this.key}, value: ${this.value}}`;
  }
}
