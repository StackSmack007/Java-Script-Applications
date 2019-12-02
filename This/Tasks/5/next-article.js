function getArticleGenerator(articles) {
  let targetDiv = document.getElementById("content");
  let data = articles.slice();

  return function() {
    if (data.length === 0) {
      return;
    }
    let elementArt = document.createElement("article");
    elementArt.textContent = data.shift();
    targetDiv.appendChild(elementArt);
  };
}