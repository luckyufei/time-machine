let index = 0;

class TimeItem {
  constructor(hour, minute) {
    this.hour = parseInt(hour, 10);
    this.minute = parseInt(minute || 0, 10);
  }

  minus(littleItem) {
    if (littleItem.hour > this.hour) throw new Error(`littleItem hour=${littleItem.hour} must less then current hour=${this.hour}`);
    const currentMins = (this.hour * 60) + this.minute;
    const littleMins = (littleItem.hour * 60) + littleItem.minute;
    if (currentMins < littleMins) throw new Error('current mins must more then little mins');
    return currentMins - littleMins;
  }
}

class OriginItem {
  constructor({
    startTime,
    title,
    cost,
    endTime,
  } = {}) {
    console.log(`OriginItem: title=${title}, cost=${cost}`);
    if (startTime) this.startTime = new TimeItem(...startTime.split(':'));
    if (endTime) this.endTime = new TimeItem(...endTime.split(':'));
    this.title = title;
    this.cost = parseInt(cost || 0, 10);
    this.index = index;
    index++;
  }

  calcCost(minusCount) {
    if ((!this.startTime || !this.endTime)) throw new Error('startTime and endTime must be setting.');
    const totalCount = this.endTime.minus(this.startTime);
    this.cost = totalCount > minusCount ? totalCount - minusCount : 0;
    return this.cost;
  }

  coststr() {
    if (this.cost < 60) return `${this.cost}分`;
    const h = Math.floor(this.cost / 60);
    const m = this.cost % 60;
    return `${h}小时${m > 0 ? `${m}分` : ''}`;
  }

  toString() {
    return `- ${this.title} — ${this.coststr()}`;
  }
}

module.exports = OriginItem;
