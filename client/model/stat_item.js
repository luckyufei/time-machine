import StatTime from './stat_time';

const TAG = '[StatItem] ';

export default class StatItem {
  constructor(key, value) {
    this.key = key;
    this.origin = value;

    try {
      if (value instanceof StatTime) {
        this.time = value;
      } else {
        let times = value.match(/(\d+小时)?(\d+分)/g);
        times = times.filter(time => !!time.trim());
        if (times.length === 1) {
          this.time = new StatTime(times[0]);
        } else {
          const statTimes = times.map(time => new StatTime(time));
          this.time = statTimes.reduce((acc, item) => acc.add(item), new StatTime());
        }
        console.log(`${TAG} constructor: {key: ${key} => times: ${times}, time: ${this.time} }`);
      }
    } catch (err) {
      console.error(`${TAG} constructor error: `, err, ', param: ', [key, value]);
    }
  }

  get value() {
    return this.time.minutes;
  }

  toString() {
    return `{key: ${this.key}, value: ${this.value}}`;
  }
}
