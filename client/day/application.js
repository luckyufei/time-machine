import CategoryCollection from '../model/collection';
import Category from '../model/category';
import DEMO from '../util/init_content';
import OriginItem from '../model/origin_item';

const TAG = '[Application] ';
const REG_STAT_ITEM = /一类工作([\r\t\s\S]*)二类工作([\r\t\s\S]*)生活休息([\r\t\s\S]*)运动健身([\r\t\s\S]*)/g;

export default class Application {
  find(...args) {
    return document.querySelector(...args);
  }

  log(...args) {
    console.log.call(console.log, '[day-stats]', ...args);
  }

  initialize() {
    this.$statsBtn = this.find('.el-button--primary');
    this.$cancelBtn = this.find('.el-button--default');
    this.$content = this.find('.origin textarea');
    this.$result = this.find('.stats-result textarea');

    this.content = DEMO;
    this.stats = '';
    this.collection = new CategoryCollection();

    this.$content.value = this.content;
    this.bindStats();
  }

  bindStats() {
    this.$statsBtn.addEventListener('click', () => {
      this.content = this.$content.value;
      if (this.content.match(REG_STAT_ITEM)) {
        this.generateStatItems();
        this.generateDaySummary();
      } else {
        this.generateDayItemList();
      }
    });
  }

  generateDayItemList() {
    const lines = this.content.split(/\n/).map(item => item.trim()).filter(item => !!item);
    const dayTitle = lines[0];
    const items = lines.slice(1);

    const originItems = items.map((item) => {
      console.log(`parse [${item}]`);
      if (item.match(/(\d+:\d+)\s*—?\s*(.*)/)) {
        const startTime = RegExp.$1;
        const title = (RegExp.$2 || '').trim();

        return new OriginItem({
          startTime,
          title,
        });
      }
      if (item.match(/^-(\d+):(.*)/)) {
        const cost = RegExp.$1;
        const title = (RegExp.$2 || '').trim();

        return new OriginItem({
          title,
          cost,
        });
      }
      return null;
    });
    for (let i = 0; i < originItems.length; i++) {
      const item = originItems[i];
      if (item.startTime) {
        let minusCount = 0;
        for (let j = i + 1; j < originItems.length; j++) {
          const nextItem = originItems[j];
          if (nextItem.startTime) {
            item.endTime = nextItem.startTime;
            item.cost = item.calcCost(minusCount);
            break;
          } else if (nextItem.cost) {
            minusCount += nextItem.cost;
          }
        }
      }
    }
    console.log('originItems: ', originItems.map(item => item.toString()));
  }

  generateDaySummary() {
    this.$result.value = this.collection.getTodaySummary();
  }

  generateStatItems() {
    this.content.replace(REG_STAT_ITEM, (block,
      m1, m2, m3, m4) => {
      // console.log(`m1: ${m1}, m2:${m2}, m3:${m3}, m4: ${m4}`);
      [m1, m2, m3, m4].forEach((item, index) => {
        let name = '一类工作';
        switch (index) {
          case 0:
            break;
          case 1:
            name = '二类工作';
            break;
          case 2:
            name = '生活休息';
            break;
          case 3:
            name = '运动健身';
            break;
          default:
            throw new Error('Unknow index: ', index);
        }
        console.log(`${TAG} ======== create category:${name} ======`);
        console.log(`${TAG} origin item info: {name: ${name}, item: ${item}}`);
        this.collection.set(name, new Category(name, item, true));
      });

      this.collection.flatten();
      return block;
    });
  }
}
