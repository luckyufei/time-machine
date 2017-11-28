import StatItem from './stat_item';
import StatTime from './stat_time';
import { ITEM_SPLITOR, REG_ITEM } from '../util/constant';

const TAG = '[Category] ';
const STAT_TIME = Symbol('Category#statTime');

export default class Category {
  constructor(title, item, root = false) {
    this.title = title;
    this.root = root;

    if (this.root) {
      const items = item ? this.parseSub(item) : [];
      this.children = items.map(sub => new Category('', sub));
      this.nodes = [];
    } else {
      const items = item ? this.parseNode(item) : [];
      this.children = [];
      this.nodes = items.map(node => new StatItem(node.key, node.value));

      if (!title && this.nodes.length > 0) {
        this.title = this.nodes[0].key;
      }
      if (this.title.split(':').length > 1) {
        this.title = this.title.split(':')[0];
      }
    }
  }

  parseNode(item) {
    const matches = item.match(REG_ITEM);
    console.log(`${TAG} prepare parse item: ${item}, matches: ${JSON.stringify(matches)}`);
    const items = matches.map((m) => {
      const [key, value] = m.split(ITEM_SPLITOR);
      const finalKey = key.replace(/^[,;]\s*/g, '');
      console.log(`${TAG} after parsed item:  [key: ${finalKey}, value: ${value}]`);
      return { key: finalKey, value };
    });
    return items;
  }

  parseSub(item) {
    const items = item.split('\n');
    console.log(`${TAG} origin items=`, items);

    const convertedItems = items.filter(item => !!item && !!item.trim())
      .map(item => item.replace(/\s{2,}/g, ''))
      .map(item => item.replace(/^-\s/g, ''));
    console.log(`${TAG} convertedItems: items = `, convertedItems);
    return convertedItems;
  }

  get time() {
    if (!this[STAT_TIME]) {
      const childrenTime = this.children.length ? this.children.reduce((acc, item) => acc.add(item.time), new StatTime()) : new StatTime();
      const nodeTime = this.nodes.length ? this.nodes.reduce((acc, item) => acc.add(item.time), new StatTime()) : new StatTime();

      this[STAT_TIME] = childrenTime.add(nodeTime);
    }
    return this[STAT_TIME];
  }

  toString() {
    return `${TAG} ${JSON.stringify(this)}`;
  }

  toMarkdown() {
    if (this.children.length) {
      const md = [`\n### ${this.title}\n`];
      md.push(`> 小计 — ${this.time.toString()}`);
      this.children.forEach((sub) => {
        md.push(`- ${sub.title} — ${sub.time.toString()}`);
      });
      return md.join('\n');
    }
    if (this.nodes.length) {
      const md = [`\n### ${this.title}\n`];
      if (this.root) { // 概览项, 它的children为空, nodes中是分类统计项
        const totalStat = this.nodes[0].time;
        this.nodes.forEach((item, idx) => {
          const result = [`- ${item.key} — ${item.time.toString()}`];
          idx > 0 && result.push(`, 占比${totalStat.percent(item.time)}`);
          md.push(result.join(''));
        });
      } else {
        this.nodes.forEach((item) => {
          md.push(`- ${item.key} — ${item.time.toString()}`);
        });
      }

      return md.join('\n');
    }
    throw new Error('Category require children or nodes is not empty!');
  }

  toMarkdownTable() {
    const totalStat = this.nodes[0].time;
    return this.nodes.map((item, idx) => {
      if (idx === 0) {
        return `|${item.key}|${item.time.toString()}|-|`;
      }
      return `|${item.key}|${item.time.toString()}|${totalStat.percent(item.time)}|`;
    });
  }
}
