import INIT_CONTENT from '../util/init_content';
import CategoryCollection from '../model/category_collection';
import Category from '../model/category';
import SubCategory from '../model/sub_category';

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

    this.content = INIT_CONTENT;
    this.stats = '';
    this.collection = new CategoryCollection();

    this.$content.value = this.content;
    this.bindStats();
  }

  bindStats() {
    this.$statsBtn.addEventListener('click', () => {
      this.content = this.$content.value;
      this.generateStatItems();
      this.generateDaySummary();
    });
  }

  generateDaySummary() {
    const summary = [];
    for (const [, category] of this.collection.entries()) {
      summary.push(category.toMarkdown());
    }
    this.log('summary: ', summary.join('\n\n'));
    this.$result.value = summary.join('\n\n');
  }

  generateStatItems() {
    this.content.replace(/一类工作([\r\t\s\S]*)二类工作([\r\t\s\S]*)生活休息([\r\t\s\S]*)运动健身([\r\t\s\S]*)/g, (block,
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
        this.collection.set(name, new Category(name, this.filterItem(item)));
      });

      this.log('this.collection: ', this.collection);
      this.collection.flatten();
      return block;
    });
  }

  createTodaySummary() {
    const summary = new Category('今日概览');
  }

  filterItem(item) {
    const items = item.split('\n');

    return items.filter(item => !!item && !!item.trim())
      .map(item => item.replace(/\s{2,}/g, ''))
      .map(item => item.replace(/^-\s/g, ''))
      // .map(item => item.split(' — '))
      .map(item => new SubCategory('', SubCategory.parse(item)));
  }
}
