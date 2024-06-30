const colorMappings = {
  W: "Mono-White",
  U: "Mono-Blue",
  B: "Mono-Black",
  R: "Mono-Red",
  G: "Mono-Green",
  WU: "(WU)",
  UB: "(UB)",
  BR: "(BR)",
  RG: "(RG)",
  GW: "(GW)",
  WB: "(WB)",
  BG: "(BG)",
  GU: "(GU)",
  UR: "(UR)",
  RW: "(RW)",
  WUR: "(WUR)",
  UBG: "(UBG)",
  BRW: "(BRW)",
  RGU: "(RGU)",
  GWB: "(GWB)",
  WUB: "(WUB)",
  UBR: "(UBR)",
  BRG: "(BRG)",
  RGW: "(RGW)",
  GWU: "(GWU)",
};

function applyColor() {
  const tds = document.querySelectorAll(".color-individual td");
  for (const td of tds) {
    const text = td.textContent.trim();
    for (const [key, value] of Object.entries(colorMappings)) {
      if (text.includes(value)) {
        td.classList.add("color", key);
        break;
      }
    }
  }
}

applyColor();

const observer = new MutationObserver(applyColor);
observer.observe(document.body, { childList: true, subtree: true });
