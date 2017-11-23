import Category from './category';
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
        title,
        children,
      } = value;
      children.forEach((subCate) => {
        subCate.nodes.forEach(stat => console.log(
          `{key: ${stat.key}, value: ${stat.origin}, category: ${title}, subcate: ${subCate.title || ''}}\r\n`));
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
    const summary = new Category('概览', '', true);
    const totalTime = new StatTime();
    summary.nodes.push(new StatItem('总计', totalTime));
    for (const [, category] of this.entries()) {
      summary.nodes.push(new StatItem(category.title, category.time));
      totalTime.add(category.time);
    }
    return summary;
  }
}
