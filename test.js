const articles = [
  { id: 1, cat: "nature", content: "toto" },
  { id: 2, cat: "tech", content: "toto" },
  { id: 3, cat: "nature", content: "toto" },
  { id: 4, cat: "tech", content: "toto" },
  { id: 5, cat: "nature", content: "toto" },
  { id: 6, cat: "politique", content: "toto" },
  { id: 7, cat: "nature", content: "toto" },
  { id: 8, cat: "toto", content: "toto" },
];

// {'nature': 4, tech: 2, politique: 2}

const acc = articles.reduce(
  (acc, article) => {
    if(acc[article['cat']]) { 
        acc[article['cat']]++
    } else {
        acc[article['cat']] = 1
    }
    return acc
  },
  {}
);

const acc2 = articles.reduce(
    (acc, article) => {
    if (!acc.includes(article.cat)) {
        acc.push(article.cat)
    }
}, [])

console.log(acc2);
