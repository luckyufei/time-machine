import CategoryCollection from '../model/collection';
import Category from '../model/category';
import { DEMO1, DEMO2 } from '../util/init_content';
import OriginItem from '../model/origin_item';

const TAG = '[Application] ';
const REG_STAT_ITEM = /##([\s\S]*)(?:[\r\t\s\S]*)#*一类工作([\r\t\s\S]*)#*二类工作([\r\t\s\S]*)#*生活休息([\r\t\s\S]*)#*运动健身([\r\t\s\S]*)/g;

export default class Application {
  find(...args) {
    return document.querySelector(...args);
  }

  log(...args) {
    console.log.call(console.log, '[day-stats]', ...args);
  }

  initialize() {
    this.$origin = this.find('.origin textarea');
    this.$generateBtn = this.find('.btn-generate');

    this.$content = this.find('.content textarea');
    this.$statsBtn = this.find('.btn-stats');
    this.$cancelBtn = this.find('.el-button--default');
    this.$result = this.find('.stats-result textarea');

    this.origin = DEMO1;
    this.$content.value = DEMO2;
    // this.content = ''; FIXME
    this.stats = '';
    this.collection = new CategoryCollection();

    this.$origin.value = this.origin;
    this.bindStats();
  }

  bindStats() {
    this.$generateBtn.addEventListener('click', () => {
      this.origin = this.$origin.value;
      this.generateDayItemList();
    });
    this.$statsBtn.addEventListener('click', () => {
      this.content = this.$content.value;
      this.generateStatItems();
      this.generateDaySummary();
    });
  }

  generateDayItemList() {
    const lines = this.origin.split(/\n/).map(item => item.trim()).filter(item => !!item);
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
    const uniqueItems = [];
    originItems.forEach((item) => {
      const found = uniqueItems.find(uni => uni.title === item.title);
      if (found) {
        found.cost += item.cost;
      } else {
        uniqueItems.push(Object.assign(new OriginItem(), item));
      }
    });
    const strItems = uniqueItems.map(item => item.toString());
    console.log('originItems: ', originItems);
    this.$content.value = this.makeReportContent(dayTitle, strItems);
  }

  makeReportContent(dailyTitle, originItems) {
    const content = [dailyTitle];

    const firstCate = ['\n### 一类工作\n'];
    const secondCate = ['\n### 二类工作\n'];
    const lifeCate = ['\n### 生活休息\n'];
    const sportCate = ['\n### 运动健身\n'];
    const uncate = ['\n### 未分类\n'];
    originItems.forEach((item) => {
      if (this.searchKeyword(['开发', '测试', '调试', '撰写', '编写', '写作'], item)) firstCate.push(item);
      else if (this.searchKeyword(['时间统计', '早会', '开会', '项目活动', '支持', '讨论', '跟进', '请教'], item)) secondCate.push(item);
      else if (this.searchKeyword(['休息', '社交', '上厕所', '厕所', '早餐', '吃午饭', '午饭', '吃早餐', '午餐', '吃午餐', '吃晚饭', '晚餐', '吃晚餐', '吃饭', '午睡', '阅读'], item)) lifeCate.push(item);
      else if (this.searchKeyword(['步行', '散步', '打乒乓球', '打羽毛球', '游泳'], item)) sportCate.push(item);
      else uncate.push(item);
    });

    return content.concat(firstCate, secondCate, lifeCate, sportCate, uncate).join('\n');
  }

  searchKeyword(keywords, item) {
    return keywords.some(key => item.indexOf(key) !== -1);
  }

  generateDaySummary() {
    console.log('this.collection: ', this.collection);
    this.$result.value = `## ${this.collection.dailyTitle}\n${this.collection.getTodaySummary()}`;
  }

  generateStatItems() {
    this.content.replace(REG_STAT_ITEM, (block,
      m1, m2, m3, m4, m5) => {
      // console.log(`m1: ${m1}, m2:${m2}, m3:${m3}, m4: ${m4}`);
      this.collection.dailyTitle = m1.replace('###', '').trim();
      [m2, m3, m4, m5].forEach((item, index) => {
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
        console.log(`${TAG} origin item info: {name: ${name}, item: ${item}`);
        this.collection.set(name, new Category(name, item, true));
      });

      this.collection.flatten();
      return block;
    });
  }
}
