# 17lands Japanese Replacer

This extension replaces the card names and images on https://www.17lands.com with Japanese ones

## all-cards.json

Downloads from https://scryfall.com/docs/api/bulk-data

### sampling

```
cat all-cards.json | jq -c '[.[] | select(.lang == "ja" or .lang == "en") | {
    lang: .lang,
    id: .id,
    name: .name,
    printed_name: .printed_name,
    oracle_id: .oracle_id,
    set_id: .set_id,
    image_uris: { large: .image_uris.large },
    card_faces: .card_faces
}]' | sponge all-cards.json
```
