export function search<T extends object>(searchTerm: string, items: T[], itemKeys: string[] = ['name']) {
  searchTerm = searchTerm.trim();
  if (searchTerm === "") {
    return items;
  }

  const scores = items.map(item => {
    let score = 0;
    for (const key of itemKeys) {
      if (item && key in item) {
        const itemT = (item as { [key]: unknown });
        if (typeof itemT[key] === 'string') {
          if (itemT[key].toLowerCase().includes(searchTerm.toLowerCase())) {
            score++;
          }
        }
      }
    }
    return score;
  });

  return items.filter((_, index) => scores[index] > 0);
}