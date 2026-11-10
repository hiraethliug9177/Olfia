import type { FamilyId } from "@/lib/types";

/**
 * Scent Library stories — Tiffany's text (2026-11-10, "Olfia — Scent Library"), unchanged.
 * One short researched story per family, with her research sources. Her research notes are kept
 * here for the record and are not shown on the page.
 */

export interface LibraryStory {
  family: FamilyId;
  title: string;
  text: string;
  sources: Array<{ label: string; href: string }>;
  researchNote: string;
}

export const LIBRARY_INTRO = "Seven fragrance families, seven little stories.";

export const STORIES: LibraryStory[] = [
  {
    family: "floral",
    title: "A Garden That Takes Its Time",
    text: "Not every floral scent comes from a flower. Rose and jasmine have long been prized for their fragrant petals, while peony, celebrated in Chinese culture as the “king of flowers,” is often recreated as a delicate perfume accord. Orange blossom has adorned wedding bouquets for centuries, symbolizing both innocence and fertility. And iris holds the loveliest secret: its soft, powdery scent comes not from the petals, but from underground rhizomes that require years of aging. Together, these flowers reveal something unexpected about floral perfumery. The freshest impression of a garden can take years of cultivation, patient extraction, and a little imagination to create.",
    sources: [
      { label: "The Perfume Society — Iris", href: "https://perfumesociety.org/ingredients-post/iris/" },
      { label: "The Perfume Society — Orange Blossom", href: "https://perfumesociety.org/ingredients-post/orange-blossom/" },
      { label: "The Perfume Society — Peony", href: "https://perfumesociety.org/ingredients-post/peony/" },
    ],
    researchNote: "Iris aging, orange blossom symbolism, and peony's cultural significance are documented facts. The final observation is an editorial interpretation.",
  },
  {
    family: "gourmand",
    title: "The Dessert That Changed Perfumery",
    text: "For centuries, perfume was expected to smell like flowers, woods, or spices—not dessert. That changed in 1992, when Mugler's *Angel* helped launch the gourmand fragrance movement with an unapologetically sweet blend of caramelized notes, honey, and vanilla. Its secret was partly chemistry: ethyl maltol, an aroma molecule reminiscent of cotton candy and caramel. Today, perfumers build on that delicious idea with roasted coffee, golden honey, and tonka bean, whose natural coumarin gives off hints of vanilla, almond, and warm hay. What makes gourmand fragrances fascinating is that their sweetness isn't necessarily about food. It's about making something invisible feel familiar, comforting, and almost edible.",
    sources: [
      { label: "Mugler — Angel Eau de Parfum: Fragrance History", href: "https://www.mugler.com/angel-and-a-men-fragrance-collection-/M010101003.html" },
      { label: "The Perfume Society — Tonka Bean", href: "https://perfumesociety.org/discover-perfume/an-introduction/ingredients/?letter=t" },
      { label: "Osmetheca — History of the Gourmand Family", href: "https://osmetheca.be/en/encyclopedia/famille-gourmande.html" },
    ],
    researchNote: "Angel's 1992 launch, its gourmand composition, ethyl maltol, and coumarin are documented. The connection to comfort and familiarity is a sensory interpretation.",
  },
  {
    family: "spicy",
    title: "A Little History of Warmth",
    text: "Long before scented candles, people perfumed their surroundings with smoke. Frankincense, a resin harvested from Boswellia trees, traveled along ancient trade routes and burned in temples and ceremonies. Cinnamon bark and dried clove buds brought warmth from the spice trade, while tobacco, introduced to Europe from the Americas, eventually contributed its sweet, earthy character to perfumery. Amber ties these materials together, though the amber of perfume is usually a constructed accord rather than a substance extracted from fossilized resin. It is a blend of warmth, sweetness, and depth. Perhaps that's why these scents feel so familiar in winter: they bring centuries of ritual, trade, and gathering into a single room.",
    sources: [
      { label: "The Perfume Society — Frankincense", href: "https://perfumesociety.org/ingredients-post/frankincense/" },
      { label: "The Perfume Society — Cinnamon", href: "https://perfumesociety.org/ingredients-post/cinnamon-2/" },
      { label: "The Perfume Society — Tobacco", href: "https://perfumesociety.org/ingredients-post/tobacco/" },
      { label: "Missouri Botanical Garden — Smelling the Bouquet (PDF)", href: "https://www.missouribotanicalgarden.org/Portals/0/Museum/2025/Sachs_SmellingTheBouquet_Digital.pdf" },
    ],
    researchNote: "Frankincense's ritual use, cinnamon's history, tobacco's movement to Europe, and amber's olfactory characteristics are supported by the sources. The final sentence is editorial storytelling.",
  },
  {
    family: "woody",
    title: "The Forest Isn't All Wood",
    text: "Some of perfumery's most beloved woody scents don't actually come from trees. Cedar gives us the dry, familiar smell of pencil shavings, while sandalwood offers a creamy softness and has long been used in Indian spiritual traditions. But vetiver's smoky earthiness comes from the roots of a grass, oakmoss is a lichen growing on tree bark, and patchouli belongs to the mint family. In the nineteenth century, patchouli leaves even traveled tucked between imported shawls, leaving a distinctive scent that became fashionable in Europe. Together, these materials recreate an entire forest—from sun-warmed timber to damp earth. Their deeper, slower-evaporating aromas also help a fragrance linger long after its brighter notes disappear.",
    sources: [
      { label: "The Perfume Society — Patchouli", href: "https://perfumesociety.org/ingredients-post/patchouli/" },
      { label: "The Perfume Society — Oakmoss", href: "https://perfumesociety.org/ingredients-post/oakmoss/" },
      { label: "The Perfume Society — Sandalwood", href: "https://perfumesociety.org/ingredients-post/sandalwood/" },
      { label: "The Perfume Society — Ingredients: Cedarwood & Vetiver", href: "https://perfumesociety.org/discover-perfume/an-introduction/ingredients/" },
    ],
    researchNote: "Botanical origins, patchouli's historical use in textiles, and the role of woody base materials are documented. The forest imagery connects these facts.",
  },
  {
    family: "green",
    title: "The Scent of Something Growing",
    text: "Before a tomato becomes a tomato, its leaves already have a scent: sharp, green, and slightly bitter. Crush one between your fingers and you'll understand the appeal of herbal perfumery. Basil brings a peppery freshness once celebrated in Arabic perfumery, while rosemary, used in the historic fragrance Hungary Water, adds a brisk, almost camphor-like edge. Lavender contributes a softer, floral-herbal character, and green tea offers a delicate, leafy impression, often recreated through carefully blended aroma molecules. Unlike sweet florals or warm woods, these scents seem to capture plants in the middle of living—freshly cut, gently bruised, or steeping in a cup. A garden, with all its imperfect freshness, brought indoors.",
    sources: [
      { label: "The Perfume Society — Tomato Leaf", href: "https://perfumesociety.org/ingredients-post/tomato-leaf/" },
      { label: "The Perfume Society — Basil", href: "https://perfumesociety.org/ingredients-post/basil/" },
      { label: "The Perfume Society — Rosemary", href: "https://perfumesociety.org/ingredients-post/rosemary/" },
      { label: "Missouri Botanical Garden — Aromatic Fragrance Materials (PDF)", href: "https://www.missouribotanicalgarden.org/Portals/0/Museum/2025/Sachs_SmellingTheBouquet_Digital.pdf" },
    ],
    researchNote: "Botanical scent profiles and rosemary's role in Hungary Water are source-supported. Green tea's description is based on general perfumery practice rather than a specific formula.",
  },
  {
    family: "citrus",
    title: "A Brief Moment of Sunshine",
    text: "The sparkle of a citrus fragrance begins in the peel. Bergamot, cultivated along the coast of Calabria, lends its distinctive aroma to Earl Grey tea. Lemon brings a sharper zest, while blood orange adds a juicy, almost raspberry-like sweetness. Grapefruit has a surprisingly recent history: a hybrid of pomelo and sweet orange, it emerged in the Caribbean centuries after many other citrus fruits were already cultivated. Pear, meanwhile, contributes a softer, watery fruitiness that balances their brightness. Together, they make some of perfumery's most fleeting top notes. Their aromatic molecules evaporate relatively quickly, which explains why a citrus fragrance can feel like the first burst of morning light: vivid, uplifting, and impossible to hold onto forever.",
    sources: [
      { label: "Missouri Botanical Garden — Bergamot and Citrus Perfumery (PDF)", href: "https://www.missouribotanicalgarden.org/Portals/0/Museum/2025/Sachs_SmellingTheBouquet_Digital.pdf" },
      { label: "The Perfume Society — Blood Orange", href: "https://perfumesociety.org/ingredients-post/blood-orange/" },
      { label: "The Perfume Society — Grapefruit", href: "https://perfumesociety.org/ingredients-post/grapefruit/" },
      { label: "The Perfume Society — Ingredients: Pear & Citrus", href: "https://perfumesociety.org/discover-perfume/an-introduction/ingredients/" },
    ],
    researchNote: "The source material supports bergamot's use in Earl Grey, grapefruit's hybrid origins, and the fruits' fragrance characteristics. The evaporation explanation reflects the typical behavior of volatile citrus top notes.",
  },
  {
    family: "fresh",
    title: "Can You Bottle the Air After Rain?",
    text: "What does clean actually smell like? Surprisingly, many things we associate with freshness have little scent of their own. Sea salt isn't responsible for the full smell of the ocean, and cotton doesn't naturally smell like freshly washed sheets. Perfumers create these impressions by combining aroma molecules: airy ozonic notes, soft laundry-like musks, and watery cucumber accords. Rain brings another fascinating clue. Its familiar earthy smell, known as petrichor, is partly associated with geosmin, a compound produced by soil microorganisms. In the 1990s, marine aroma molecules such as Calone helped popularize a new generation of aquatic fragrances. Freshness, it turns out, isn't one particular smell. It's a carefully constructed memory of water, air, and open space.",
    sources: [
      { label: "Chemistry — Occurrence of Marine Ingredients in Fragrance: Update on the State of Knowledge", href: "https://www.mdpi.com/2624-8549/3/4/103" },
      { label: "Osmetheca — Marine and Aquatic Fragrance Family", href: "https://osmetheca.be/en/encyclopedia/famille-marine-aquatique.html" },
      { label: "The Perfume Society — Fragrance Ingredients", href: "https://perfumesociety.org/discover-perfume/an-introduction/ingredients/" },
    ],
    researchNote: "Calone's contribution to aquatic perfumery and synthetic marine accords is documented. Petrichor's relationship to geosmin is established scientific knowledge; the linked sources primarily cover marine fragrance chemistry.",
  },
];

export const storyFor = (family: FamilyId): LibraryStory | undefined => STORIES.find((s) => s.family === family);
