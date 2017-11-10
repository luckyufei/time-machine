import SubCategory from './sub_category';
import StatItem from './stat_item';
import StatTime from './stat_time';

export default class CategoryCollection extends Map {

  toString() {
    for (const [key, category] of this.entries()) {
      console.log(`[CategoryCollection] ${key}: [${JSON.stringify(category)}]`);
    }
  }

  flatten() {
    for (const [, value] of this.entries()) {
      const {
        category,
        subCates,
      } = value;
      subCates.forEach((subItem) => {
        subItem.forEach(stat => console.log(
          `{key: ${stat.key}, value: ${stat.origin}, category: ${category}, subcate: ${subItem.subCate || ''}}\r\n`));
      });
    }
  }

  getTodaySummary() {
    const summary = [];
    for (const [, category] of this.entries()) {
      summary.push(category.toMarkdown());
    }
    const sumCategory = this.createTodaySumCategory();
    summary.push(sumCategory.toMarkdown());
    return summary.join('\n\n');
  }

  createTodaySumCategory() {
    const summary = new SubCategory('概览', []);
    const totalTime = new StatTime();
    summary.push(new StatItem('总计', totalTime));
    for (const [, category] of this.entries()) {
      summary.push(new StatItem(category.category, category.statTime));
      totalTime.add(category.statTime);
    }
    return summary;
  }
}
