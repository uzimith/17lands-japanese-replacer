import fs from "fs";
const data = JSON.parse(fs.readFileSync("all-cards.json", "utf8"));

const cardImageMap = {};
const cardNameMap = {};

const japaneseCardMap = new Map();
data.forEach((card) => {
  if (card.lang === "ja") {
    // for image
    const key = `${card.oracle_id}-${card.set_id}`;
    japaneseCardMap.set(key, card);
    const subKey = `${card.oracle_id}`;
    japaneseCardMap.set(subKey, card);

    // for name
    if (card.printed_name && card.name !== card.printed_name) {
      cardNameMap[card.name] = card.printed_name;
    }
    if (card.card_faces) {
      for (const face of card.card_faces) {
        // scryfall data error case
        if (card.name === face.printed_name) {
          continue;
        }
        if (face.printed_name && face.name !== face.printed_name) {
          cardNameMap[face.name] = face.printed_name;
        }
      }

      const printedNames = card.card_faces
        .map((face) => {
          // scryfall data error case
          if (card.name === face.printed_name) {
            return null;
          }

          return face.printed_name;
        })
        .filter((name) => name);
      if (printedNames.length > 0 && card.name !== printedNames.join(" // ")) {
        cardNameMap[card.name] = printedNames.join(" // ");
      }
    }
  }
});

data.forEach((card) => {
  if (card.lang === "en") {
    const key = `${card.oracle_id}-${card.set_id}`;
    const subKey = `${card.oracle_id}`;
    const japaneseCard =
      japaneseCardMap.get(key) || japaneseCardMap.get(subKey);

    if (
      japaneseCard &&
      japaneseCard.image_uris &&
      japaneseCard.image_uris.large
    ) {
      cardImageMap[card.id] = {
        front: japaneseCard.image_uris.large,
      };
    } else if (japaneseCard && japaneseCard.card_faces) {
      cardImageMap[card.id] = {};
      for (const face of japaneseCard.card_faces) {
        if (face.image_uris && face.image_uris.large) {
          if (face.image_uris.large.match(/front/)) {
            cardImageMap[card.id].front = face.image_uris.large;
          }
          if (face.image_uris.large.match(/back/)) {
            cardImageMap[card.id].back = face.image_uris.large;
          }
        }
      }
    }
  }
});

fs.writeFileSync("cardImageMap.json", JSON.stringify(cardImageMap, null, null));
fs.writeFileSync("cardNameMap.json", JSON.stringify(cardNameMap, null, null));
