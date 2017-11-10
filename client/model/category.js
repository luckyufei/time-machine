import StatTime from './stat_time';

export default class Category {
  constructor(category, subCates) {
    this.category = category;
    this.subCates = subCates;
    this.statTime = this.subCates.reduce((acc, item) => acc.add(item.statTime), new StatTime());
  }

  toString() {
    return `[Category] ${this.category}: [${JSON.stringify(this.subCates)}]`;
  }

  toMarkdown() {
    const md = [`### ${this.category}`];
    md.push(`- 小计 — ${this.statTime.toString()}`);
    this.subCates.forEach((sub) => {
      md.push(`- ${sub.subCate} — ${sub.statTime.toString()}`);
    });
    return md.join('\n');
  }
}
