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
        const {
          subCate,
          items,
        } = subItem;
        items.forEach(stat => console.log(
          `{key: ${stat.key}, value: ${stat.origin}, category: ${category}, subcate: ${subCate || ''}}\r\n`));
      });
    }
  }
}
