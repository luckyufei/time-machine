import StatTime from './stat_time';

export default class StatItem {
  constructor(key, value) {
    this.key = key;
    this._origin = value;

    try {
      if (value instanceof StatTime) {
        this.statTime = value;
      } else {
        const times = value.match(/[^,;]*?(?:\d+小时)?\d+分(,\s*\d+分)?/g);
        console.log('[StatItem] times: ', times);
        if (times.length === 1) {
          this.statTime = new StatTime(times[0]);
        } else {
          const statTimes = times.map(time => new StatTime(time));
          this.statTime = statTimes.reduce((acc, item) => acc.add(item), new StatTime());
        }
      }
    } catch (err) {
      console.error('[StatItem] constructor error: ', err, ', param: ', [key, value]);
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
