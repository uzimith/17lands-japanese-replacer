let cardImageMap = null;
let cardNameMap = null;

async function loadCardsData() {
  const [imageResponse, nameResponse] = await Promise.all([
    fetch(chrome.runtime.getURL("cardImageMap.json")),
    fetch(chrome.runtime.getURL("cardNameMap.json")),
  ]);
  const imageData = await imageResponse.json();
  const nameData = await nameResponse.json();
  cardImageMap = imageData;
  cardNameMap = nameData;
  startObserver();
}

loadCardsData();

const replaceCardContent = (nodes) => {
  nodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === "IMG") {
        const src = node.src;
        if (src.match(/^https:\/\/cards.scryfall.io\/large\//)) {
          const cardId = src.split("/").pop().split(".")[0];
          if (cardImageMap[cardId]) {
            if (src.match(/front/) && cardImageMap[cardId].front) {
              node.src = cardImageMap[cardId].front;
            } else if (src.match(/back/) && cardImageMap[cardId].back) {
              node.src = cardImageMap[cardId].back;
            }
          }
        }
      } else {
        replaceCardContent(node.childNodes);
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (cardNameMap[text]) {
        node.textContent = cardNameMap[text];
      }
    }
  });
};

function startObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        replaceCardContent(mutation.addedNodes);
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
