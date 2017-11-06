import StatItem from './stat_item';
import StatTime from './stat_time';

const ITEM_SPLITOR = ' — ';

export default class SubCategory {

  static parse(item) {
    const ITEM_REG = /.*?(?:\d+小时)?\d+分(,\s*\d+分)?/g;
    const matches = item.match(ITEM_REG);
    const items = matches.map((m) => {
      const [key, value] = m.split(ITEM_SPLITOR);
      const finalKey = key.replace(/^[,;]\s*/g, '');

      return new StatItem(finalKey, value);
    });
    return items;
  }

  constructor(subCate, items) {
    this.subCate = subCate;
    this.items = items;

    if (!subCate && items.length > 0) {
      this.subCate = this.items[0].key;
    }
    this.statTime = this.items.reduce((acc, item) => acc.add(item.statTime), new StatTime());
  }

  toString() {
    return `[SubCategory] ${this.category}: [${JSON.stringify(this.items)}]`;
  }
}
