import StatItem from './stat_item';
import StatTime from './stat_time';
import { ITEM_SPLITOR, REG_ITEM } from '../util/constant';

export default class SubCategory extends Array {

  static parse(item) {
    const matches = item.match(REG_ITEM);
    const items = matches.map((m) => {
      const [key, value] = m.split(ITEM_SPLITOR);
      const finalKey = key.replace(/^[,;]\s*/g, '');

      return new StatItem(finalKey, value);
    });
    return items;
  }

  constructor(subCate, items) {
    super(...items);
    this.subCate = subCate;

    if (!subCate && this.length > 0) {
      this.subCate = this[0].key;
    }
    if (this.subCate.split(':').length > 1) {
      this.subCate = this.subCate.split(':')[0];
    }
    this.statTime = this.reduce((acc, item) => acc.add(item.statTime), new StatTime());
  }

  toString() {
    return `[SubCategory] ${this.subCate}: [${JSON.stringify(this)}]`;
  }

  toMarkdown() {
    const md = [`### ${this.subCate}`];
    const totalStat = this[0].statTime;
    this.forEach((item, idx) => {
      md.push(`- ${item.key} — ${item.statTime.toString()}${idx > 0 ? `, 占比${totalStat.percent(item.statTime)}` : ''}`);
    });
    return md.join('\n');
  }
}
