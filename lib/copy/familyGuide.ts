/* Generated from docs/copy/olfia-site-copy-v1.md (Tiffany's copy v1, 11/24) by gen_copy.py. Edit the document, not this file. */
import type { FamilyId } from "@/lib/types";
import type { ResearchId } from "@/lib/copy/research";

export interface FamilyGuide {
  card: string;
  descriptors: string;
  signatureNotes: string;
  atHome: string;
  pairing: string;
  recipe: { title: string; main: string; accent: string; body: string };
  cardSources: readonly ResearchId[];
  onWheel: string;
  guide: readonly string[];
  guideSources: readonly ResearchId[];
}

/** §1.2 (Home dial cards) and §7.2 (Scentpedia guides) share this data, keyed by the existing family ids. */
export const FAMILY_GUIDE: Record<FamilyId, FamilyGuide> = {
  "floral": {
    "card": "Petal-like · Dewy · Powdery. Flowers can feel like crisp petals, a full bouquet, or a powdery cosmetic accord.",
    "signatureNotes": "Rose, jasmine, peony, orange blossom, iris",
    "atHome": "Think of flowers on a dining table, a spring garden, or a powdery dressing room. Choose a fresh floral for a lighter impression or iris for a more velvety one.",
    "pairing": "Bergamot gives rose a crisp opening; soft woods offer a warmer background.",
    "recipe": {
      "title": "Flowers by the window",
      "main": "Rose",
      "accent": "Bergamot",
      "body": "Try a rose-led fragrance with a trace of citrus. Notice whether the rose feels more like freshly cut flowers or a sweeter bouquet."
    },
    "cardSources": [
      "R2",
      "R3",
      "R9",
      "R10"
    ],
    "descriptors": "Petal-like · Dewy · Powdery",
    "onWheel": "Floral, Soft Floral",
    "guide": [
      "A floral fragrance can bring to mind a single flower, a garden in full bloom, or the powdery scent of a dressing table. The differences lie in the qualities of the flowers and in the materials that surround them. Rose can be fresh and almost green or rich and honeyed; jasmine and orange blossom often have a fuller white-floral character. Peony tends to suggest a delicate bouquet, while iris introduces a dry, powdery impression that feels quite unlike freshly cut petals.",
      "On Michael Edwards’ wheel, Olfia’s Floral family is closest to Floral and Soft Floral. The latter offers a useful way to understand the distinction between a recognizable bouquet and a softer, more abstract floral impression. A floral composition can also move toward Floral Amber when warmer materials become more prominent. A named flower on a label may describe a reconstructed accord, so it does not necessarily tell you which botanical extracts are present.",
      "For the home, begin by choosing which floral character appeals to you. A rose-led fragrance with bergamot might evoke flowers beside an open window, while a powdery iris accord could suit a more intimate dressing area. Try smelling both before choosing a product. The contrast is a good way to develop your own vocabulary for floral fragrances."
    ],
    "guideSources": [
      "R2",
      "R3",
      "R9",
      "R19",
      "R10"
    ]
  },
  "gourmand": {
    "card": "Toasted · Creamy · Sweet. Food-inspired notes evoke roasted coffee, caramel, and creamy desserts.",
    "signatureNotes": "Vanilla, tonka, honey, coffee, caramel",
    "atHome": "Explore food-like aromas in a living room or dining nook; roasted notes can feel quite different from sugary ones.",
    "pairing": "Coffee brings roasted bitterness to vanilla; cedar can introduce a drier contrast.",
    "recipe": {
      "title": "Sunday coffee",
      "main": "Vanilla",
      "accent": "Coffee",
      "body": "Look for a vanilla-and-coffee candle or diffuser. Start gently and see whether the toasted note balances the sweetness."
    },
    "cardSources": [
      "R2",
      "R4",
      "R9",
      "R10"
    ],
    "descriptors": "Toasted · Creamy · Sweet",
    "onWheel": "Olfia category; overlaps Amber and Fruity",
    "guide": [
      "What makes a fragrance smell like dessert? Gourmand scents borrow their vocabulary from the kitchen: the caramelized edge of sugar, roasted coffee beans, vanilla cream, honey, and the almond-like sweetness of tonka. Some suggest a bakery, others a cup of coffee or a piece of dark chocolate. Their appeal often comes from the recognition of a familiar food rather than a literal recreation of its flavor.",
      "Gourmand became particularly prominent in modern perfumery after the success of Mugler’s Angel. It is not a dedicated segment on Michael Edwards’ classic wheel, although its sweet and rich qualities often intersect with Amber, and fruit-led compositions may sit elsewhere. Olfia treats Gourmand as a separate family because edible associations are an especially useful distinction when choosing fragrance for the home. Vanilla can appear in either an amber or a gourmand product; the overall impression matters more than a single note.",
      "Begin by deciding whether you prefer creamy sweetness, toasted bitterness, or something more like caramel. In a sitting room, coffee and vanilla can suggest a slow breakfast; near a dining table, a more subtle scent may be preferable to an intense dessert accord. Look for a product that pairs vanilla with coffee or dry wood and compare it with a sweeter alternative."
    ],
    "guideSources": [
      "R2",
      "R4",
      "R9",
      "R19",
      "R10"
    ]
  },
  "spicy": {
    "card": "Resinous · Spiced · Balsamic. Resins and spices range from sweet amber to dry incense and clove.",
    "signatureNotes": "Amber, cinnamon, clove, frankincense, tobacco",
    "atHome": "Try resinous or spiced notes on an autumn evening, in a sitting room, or around a seasonal gathering.",
    "pairing": "Cedar gives amber a dry backbone; orange peel can lighten a dense spice impression.",
    "recipe": {
      "title": "The first cold evening",
      "main": "Amber",
      "accent": "Cedar",
      "body": "Choose an amber-led fragrance with a dry wood accent. Compare it with a sweeter vanilla amber to learn which kind of warmth you prefer."
    },
    "cardSources": [
      "R1",
      "R2",
      "R9",
      "R10"
    ],
    "descriptors": "Resinous · Spiced · Balsamic",
    "onWheel": "Soft Amber, Amber, Woody Amber",
    "guide": [
      "Warm & Spicy brings together several kinds of aromatic warmth. Cinnamon and clove are immediately recognizable as spices, while frankincense has a resinous character that can feel dry or smoky. Tobacco accords may suggest dried leaves or a darker sweetness. Amber in perfumery generally refers to a constructed scent impression, commonly involving sweet or balsamic materials, rather than the smell of a piece of fossilized resin.",
      "Olfia draws this family mainly from the Amber region of Michael Edwards’ Fragrance Wheel, including Soft Amber, Amber, and Woody Amber. The differences are worth noticing: an incense-like scent can have a much drier character than a sweet balsamic amber, while a wood-led composition adds another dimension of depth. This helps explain why two products described as warm might feel entirely different when you smell them.",
      "In a living room, think about what kind of warmth you want to introduce. An amber-and-cedar fragrance can suggest polished wood and a late evening indoors; an orange-and-clove accord recalls a more seasonal, festive atmosphere. If you are new to richer scents, choose a gentle product and try it for a short period according to its directions. The most useful first comparison is between a sweet amber and a drier, spiced or resinous fragrance."
    ],
    "guideSources": [
      "R1",
      "R2",
      "R9",
      "R19",
      "R10"
    ]
  },
  "woody": {
    "card": "Dry · Mossy · Smoky · Creamy. From pencil shavings to forest soil, wood-like scents vary in dryness and depth.",
    "signatureNotes": "Cedar, sandalwood, vetiver, oakmoss, patchouli",
    "atHome": "Try crisp cedar in a study, softer sandalwood in a bedroom, or vetiver when you want a more earthy character.",
    "pairing": "Bergamot brings contrast; amber adds warmth; green herbs can echo the forest-like quality.",
    "recipe": {
      "title": "An afternoon in the study",
      "main": "Cedar",
      "accent": "Bergamot",
      "body": "Try a cedar-based product with a subtle citrus accent. Notice how the bright opening changes the impression of dry wood."
    },
    "cardSources": [
      "R1",
      "R5",
      "R6",
      "R9",
      "R10"
    ],
    "descriptors": "Dry · Mossy · Smoky · Creamy",
    "onWheel": "Woods, Mossy Woods, Dry Woods",
    "guide": [
      "Think of freshly sharpened pencils, a wooden cabinet, or damp ground beneath a forest canopy. Woody and earthy fragrances encompass a range of textures, from the dry character of cedar to the creamy softness of sandalwood and the grassy, sometimes smoky quality of vetiver. Oakmoss and patchouli bring earthier impressions that can suggest vegetation and soil rather than timber alone.",
      "Within Michael Edwards’ Fragrance Wheel, Olfia’s Woody & Earthy family draws primarily from Woods, Mossy Woods, and Dry Woods. Mossy compositions can connect earthy notes with brighter facets, while dry styles may evoke smoke, leather, or a more austere wood character. The classification gives you a way to compare different interpretations of a forest-like scent, even when the ingredient lists have little in common.",
      "At home, consider the quality of wood you enjoy. Cedar can complement the association of paper, books, and furniture in a study. Sandalwood may appeal when you want a softer impression in a bedroom, while vetiver can introduce a less sweet, more earthy character. For a first experiment, seek a cedar fragrance with a bergamot accent; the citrus brings a brighter contrast. Alternatively, compare sandalwood with vanilla or amber to discover whether you prefer a warmer, sweeter direction. Notice which version feels most at home in your own space."
    ],
    "guideSources": [
      "R1",
      "R5",
      "R6",
      "R9",
      "R19",
      "R10"
    ]
  },
  "green": {
    "card": "Leafy · Aromatic · Bitter. Leaves, stems, and aromatic herbs bring distinct botanical impressions.",
    "signatureNotes": "Basil, tomato leaf, rosemary, lavender, green tea",
    "atHome": "Think of herbs on a kitchen windowsill or a green tea note beside a desk. A leafy fragrance can feel quite different from a floral herb.",
    "pairing": "Lemon emphasizes the brisk side of rosemary; soft woods give green notes a more grounded character.",
    "recipe": {
      "title": "Herbs on the windowsill",
      "main": "Rosemary",
      "accent": "Lemon",
      "body": "Look for a rosemary-and-lemon fragrance or compare the two scents separately. Decide whether you prefer the herbal or citrus character to lead."
    },
    "cardSources": [
      "R7",
      "R9",
      "R10"
    ],
    "descriptors": "Leafy · Aromatic · Bitter",
    "onWheel": "Green, Aromatic",
    "guide": [
      "Imagine snapping a stem, rubbing rosemary between your fingers, or walking past tomato plants on a warm afternoon. Green fragrances often recall leaves, stems, grasses, and vegetation, whereas herbal and aromatic notes can bring the distinctive sharpness of kitchen herbs. Lavender has a floral side as well as its recognizable herbal character. Green tea may feel delicate and leafy, while tomato leaf can suggest something much more bitter and alive.",
      "The Green and Aromatic areas of Michael Edwards’ Fragrance Wheel help explain why these scents belong together in Olfia, despite their variety. A leaf-like fragrance can overlap with floral or woody notes, and an aromatic composition can include citrus or spices. Olfia uses a single Green & Herbal category to make these botanical impressions easier to explore in a home context.",
      "Try beginning with an actual herb you recognize, then look for that note in a home fragrance. A rosemary-and-lemon composition might remind you of a kitchen windowsill, while green tea and soft wood offer a different direction for a desk or reading corner. Compare a fresh leafy scent with a lavender-led one and notice which side of the family you enjoy. You may discover that the smell of a plant in its natural setting and its interpretation in a fragrance are quite different experiences."
    ],
    "guideSources": [
      "R7",
      "R9",
      "R19",
      "R10"
    ]
  },
  "citrus": {
    "card": "Zesty · Juicy · Tart. Peel-like brightness and juicy fruit offer different kinds of freshness.",
    "signatureNotes": "Bergamot, lemon, blood orange, grapefruit, pear",
    "atHome": "Try bright citrus in an entryway or kitchen; consider a softer pear note when you want a less sharp fruit impression.",
    "pairing": "Green tea offers a leafy contrast to grapefruit; floral notes can soften a tart fruit profile.",
    "recipe": {
      "title": "Windows open, morning",
      "main": "Grapefruit",
      "accent": "Green tea",
      "body": "Try a grapefruit-led fragrance with a tea-like accent. Compare it with a sweeter fruit fragrance and notice the difference in character."
    },
    "cardSources": [
      "R1",
      "R7",
      "R9",
      "R10"
    ],
    "descriptors": "Zesty · Juicy · Tart",
    "onWheel": "Citrus, Fruity",
    "guide": [
      "There is a difference between the sharp scent released when you peel a lemon and the softer, watery sweetness of a ripe pear. Citrus & Fruit brings both kinds of impressions together. Bergamot has a distinctive aromatic brightness; grapefruit can have a tart edge, blood orange can feel juicier, and lemon often suggests a more direct zest. Fruit accords extend that vocabulary beyond citrus peels into softer, sometimes almost jam-like territory.",
      "On Michael Edwards’ Fragrance Wheel, Citrus and Fruity are distinct areas within the broader fresh region. Olfia groups them because both offer familiar references for someone learning to describe scents at home. Citrus materials are often used to give a fragrance a bright opening, while fruit impressions can be constructed in many different ways. A citrus-led room fragrance may change over time as other notes emerge; its duration also depends on how the product is made and used.",
      "For a first comparison, try smelling a piece of citrus peel and a ripe fruit. Then explore home fragrances that recall each. Grapefruit with green tea might appeal in an entryway or at the start of a day, whereas pear with a floral accent may suggest a softer atmosphere. Look beyond the fruit name on a label and ask whether the scent feels tart, juicy, sweet, or dry to you."
    ],
    "guideSources": [
      "R1",
      "R7",
      "R9",
      "R19",
      "R10"
    ]
  },
  "fresh": {
    "card": "Airy · Watery · Linen-like. Aquatic and fabric-inspired accords evoke water, air, and freshly washed textiles.",
    "signatureNotes": "Sea salt, rain, ozone, cotton, cucumber",
    "atHome": "Explore a water-like scent in a bathroom or a fabric-inspired accord near freshly washed linens.",
    "pairing": "Lavender brings an herbal-floral accent to a cotton accord; citrus can make aquatic scents feel brighter.",
    "recipe": {
      "title": "Fresh sheets, afternoon sun",
      "main": "Cotton accord",
      "accent": "Lavender",
      "body": "Choose a cotton-and-lavender home fragrance. Notice whether it reminds you more of fabric, flowers, or the air around an open window."
    },
    "cardSources": [
      "R7",
      "R8",
      "R9",
      "R10"
    ],
    "descriptors": "Airy · Watery · Linen-like",
    "onWheel": "Water; overlaps other fresh and soft profiles",
    "guide": [
      "Fresh & Clean is a family built around impressions that can be difficult to name: air after rain, water near the coast, or a stack of just-washed sheets. Aquatic and ozonic notes suggest water and open air, while laundry-inspired accords often have a soft, musky character. Cotton and sea salt on a fragrance label are usually sensory associations; the product is evoking an experience rather than necessarily containing those materials as its source of scent.",
      "The Water area of Michael Edwards’ wheel is the closest starting point for Olfia’s Fresh & Clean family. Other clean-smelling fragrances can overlap with Soft Floral, Citrus, or aromatic profiles. Olfia groups water-like and textile-inspired impressions together to help people distinguish this kind of freshness from the zest of a lemon or the greenness of a leaf. The categories remain flexible because the character of a complete fragrance depends on the composition.",
      "At home, explore which kind of freshness you actually prefer. A marine accord might remind you of a coastal walk, whereas a cotton-and-lavender fragrance could recall fresh bedding. Try comparing these two directions in a bathroom or entryway, using products as directed. A clean-smelling fragrance is an aesthetic choice; it does not clean the air or replace ventilation. Sometimes the most pleasant option is simply an open window and no added scent."
    ],
    "guideSources": [
      "R7",
      "R8",
      "R9",
      "R19",
      "R10"
    ]
  }
};

export const WHEEL_HINT = "Start with one fragrance. To explore a pairing, look for a product containing both notes, or try separately used products one at a time according to their directions. Keep the scent gentle, and stop if it feels overwhelming." as const;
export const GUIDE_INTRO = "Fragrance families give us a language for describing scents. Olfia adapts Michael Edwards’ wheel for the home; our seven categories can overlap. A note describes an impression and may be an accord rather than a literal ingredient. Try them as a starting point for discovering what you enjoy." as const;
