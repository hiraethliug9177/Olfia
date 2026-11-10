import type { FamilyId } from "@/lib/types";

/**
 * The Olfia Edit — articles. Text, images, credits and references are Tiffany's (2026-11-09),
 * converted from her file "The Edit — Three Articles" without rewording. Inline *italics* and
 * **bold** are kept as she wrote them and rendered by components/edit/Rich.tsx.
 * Images are linked from their sources with credit, for the academic prototype; each has a drawn
 * fallback cover in components/edit/ArticleCover.tsx if the source stops serving it.
 */

export type Topic = "Film" | "Places" | "Seasons";

export interface ArticleImage { src: string; alt: string; credit: string; creditHref?: string }
export type Block = { t: "h" | "p"; text: string };

export interface Article {
  slug: string;
  topic: Topic;
  kicker: string;
  readTime: string;
  date: string;
  title: string;
  dek: string;
  families: FamilyId[];
  image: ArticleImage | null;
  fallback: "pool" | "lobby" | "pomander";
  blocks: Block[];
  tryThis: { title: string; paras: string[] };
  takeHome: { name: string; paras: string[] };
  object: { name: string; notes: string; meta: string; href: string; cta: string };
  objectImage: ArticleImage | null;
  references: Array<{ before: string; label: string; href: string; after: string }>;
}

export const TOPICS: Topic[] = ["Film", "Places", "Seasons"];

export const ARTICLES: Article[] = [
  {
    "slug": "if-barbie-land-had-a-smell",
    "topic": "Film",
    "families": [
      "citrus",
      "fresh"
    ],
    "fallback": "pool",
    "date": "2026-11-10",
    "image": {
      "src": "https://assets.vogue.com/photos/64ba6becc65c9f68561f660e/master/w_1600%2Cc_limit/MCDBARB_WB005.jpg",
      "alt": "Barbie Land, a film still from Barbie (2023)",
      "credit": "Warner Bros. Pictures / Courtesy Everett Collection, via Vogue",
      "creditHref": "https://www.vogue.com/article/barbie-production-designer-interview"
    },
    "objectImage": {
      "src": "https://cdn.sanity.io/images/kie4hq77/development/73a28f68ce87303e774885c64288e9e4684374b4-2000x1853.jpg?auto=format&fit=max&q=75&w=800",
      "alt": "“VACATION” by Vacation Eau de Toilette",
      "credit": "Vacation"
    },
    "kicker": "Film & Fragrance",
    "readTime": "5 min read",
    "title": "If Barbie Land Had a Smell, Would It Be Plastic?",
    "dek": "On childhood nostalgia, the smell of swimming pools, and why artificial things can make us feel surprisingly real.",
    "blocks": [
      {
        "t": "p",
        "text": "Somewhere in Greta Gerwig's *Barbie* (2023), between the perfectly pink Dreamhouses and the increasingly existential Ken, there is a swimming pool without any water in it."
      },
      {
        "t": "p",
        "text": "It is painted blue. Nobody seems particularly bothered."
      },
      {
        "t": "p",
        "text": "That's the wonderful thing about Barbie Land: everything looks exactly as it should, provided you don't expect anything to function. The ocean is artificial. The refrigerator contains imaginary food. The characters appear to shower without actually getting wet."
      },
      {
        "t": "p",
        "text": "Naturally, this raises an important question: **What on earth does Barbie Land smell like?**"
      },
      {
        "t": "h",
        "text": "Life in Plastic, Smells Fantastic"
      },
      {
        "t": "p",
        "text": "Production designer Sarah Greenwood and set decorator Katie Spencer approached Barbie Land as something between midcentury California and a life-size toy box. The Dreamhouse took inspiration from Palm Springs modernism, but its proportions were deliberately strange. Everything was scaled to make the actors seem slightly too large for their surroundings."
      },
      {
        "t": "p",
        "text": "The result is a world that feels familiar even though it never existed."
      },
      {
        "t": "p",
        "text": "And that, curiously, is how nostalgia works."
      },
      {
        "t": "p",
        "text": "Think about the smell of opening a new toy. Fresh plastic, cardboard packaging, perhaps a faintly sweet trace of the artificial strawberry fragrance that seemed to follow children's products through the 1990s and 2000s."
      },
      {
        "t": "p",
        "text": "Or remember the particular smell of an American summer: sunscreen, chlorine, warm concrete, and the rubbery interior of an inflatable pool toy."
      },
      {
        "t": "p",
        "text": "None of these would ordinarily make a perfumer's list of beautiful natural ingredients. Yet they're capable of summoning entire childhoods."
      },
      {
        "t": "p",
        "text": "Maybe we're drawn to certain fragrances not because they smell objectively wonderful, but because they remind us of the people we used to be."
      },
      {
        "t": "h",
        "text": "The Perfume That Smells Like a Swimming Pool"
      },
      {
        "t": "p",
        "text": "Consider the American fragrance brand Vacation."
      },
      {
        "t": "p",
        "text": "Its aptly named *VACATION* Eau de Toilette includes coconut, banana, pineapple, and orange blossom, alongside more eccentric notes: pool water and swimsuit fabric."
      },
      {
        "t": "p",
        "text": "Yes, swimsuit fabric."
      },
      {
        "t": "p",
        "text": "These are imaginative fragrance accords rather than actual pieces of swimwear dissolved in perfume. They're designed to suggest experiences rather than reproduce literal ingredients."
      },
      {
        "t": "p",
        "text": "It's a clever proposition. Instead of pretending perfume must transport us to a mysterious Mediterranean garden, Vacation offers something far more recognizable: a swimming pool on a sunny afternoon."
      },
      {
        "t": "p",
        "text": "There's an obvious resemblance to Barbie Land's bright California fantasy, though the fragrance is not affiliated with the film."
      },
      {
        "t": "h",
        "text": "The Beauty of Something Imperfect"
      },
      {
        "t": "p",
        "text": "The interesting thing about *Barbie* is that its perfectly manufactured world eventually becomes insufficient."
      },
      {
        "t": "p",
        "text": "Barbie discovers that being human involves discomfort, uncertainty, aging, and the possibility of things going wrong. The movie's emotional center isn't the perfection of the Dreamhouse. It's her desire to experience what exists beyond it."
      },
      {
        "t": "p",
        "text": "Fragrance can work in much the same way."
      },
      {
        "t": "p",
        "text": "A deliberately synthetic scent can evoke something completely genuine. It doesn't need to smell like a real tropical island to remind you of a wonderful vacation."
      },
      {
        "t": "p",
        "text": "Sometimes the fake swimming pool is enough."
      }
    ],
    "tryThis": {
      "title": "Recreate Your Childhood Summer",
      "paras": [
        "Find a photograph from a childhood vacation, ideally somewhere with a swimming pool.",
        "Spray a little sunscreen-scented fragrance onto a paper blotter. Close your eyes and notice which memory arrives first: the location, the people, or a particular feeling.",
        "Then ask yourself whether the scent matches the photograph or a summer you've reconstructed in your imagination."
      ]
    },
    "takeHome": {
      "name": "Vacation — \"VACATION\" Eau de Toilette",
      "paras": [
        "A surprisingly sophisticated interpretation of poolside nostalgia, with coconut, banana, pineapple, orange blossom, a pool toy, and the wonderfully peculiar suggestion of swimsuit fabric.",
        "It's not Barbie's official perfume. It's a scent that understands the appeal of her world.",
        "And unlike the Dreamhouse swimming pool, this one actually exists."
      ]
    },
    "object": {
      "name": "Vacation — “VACATION” Eau de Toilette",
      "notes": "Coconut · Banana · Pineapple · Orange Blossom · Pool Water · Pool Toy · Swimsuit Fabric",
      "meta": "$60 · 30 mL / 1 fl oz · Official Vacation store",
      "href": "https://vacation.inc/products/vacation-by-vacation",
      "cta": "Discover the fragrance"
    },
    "references": [
      {
        "before": "Silver, J. (2023, July 21).",
        "label": "How Barbie’s production designers created the plastic, fantastic world of Barbie Land",
        "href": "https://www.vogue.com/article/barbie-production-designer-interview",
        "after": ". *Vogue*. Production design, architectural inspiration, and the logic of Barbie Land."
      },
      {
        "before": "Zemler, E. (2024, January 12).",
        "label": "“What on Earth does a world like this look like?” The mission to design Barbie Land",
        "href": "https://www.latimes.com/entertainment-arts/awards/story/2024-01-12/sarah-greenwood-katie-spencer-create-barbie-land",
        "after": ". *Los Angeles Times*. Production-design interview; access may depend on subscription."
      },
      {
        "before": "Vacation. (n.d.).",
        "label": "“VACATION” by Vacation Eau de Toilette",
        "href": "https://vacation.inc/products/vacation-by-vacation",
        "after": ". Official product concept, notes, size, and price."
      }
    ]
  },
  {
    "slug": "the-most-expensive-thing-in-a-hotel-lobby",
    "topic": "Places",
    "families": [
      "citrus",
      "woody"
    ],
    "fallback": "lobby",
    "date": "2026-11-10",
    "image": {
      "src": "/assets/edit/hotel-courtyard.webp",
      "alt": "A hotel courtyard of plaster arches around a still reflecting pool",
      "credit": "Image supplied by the author for this prototype"
    },
    "objectImage": {
      "src": "https://shop.marriott.com/dw/image/v2/BLCS_PRD/on/demandware.static/-/Sites-productCatalog_MBB/default/dwa74e7f1a/images/main/edition-candle-6.7oz-lit-0020_fondant.jpg?sh=1062&sw=840",
      "alt": "EDITION Signature Black Tea Candle",
      "credit": "Marriott Bonvoy Boutiques / EDITION"
    },
    "kicker": "Spaces & Scent",
    "readTime": "5 min read",
    "title": "The Most Expensive Thing in a Hotel Lobby Might Be the Smell",
    "dek": "Inside EDITION Hotels' black tea obsession, and the business of making luxury feel like a memory.",
    "blocks": [
      {
        "t": "p",
        "text": "You walk into a luxury hotel after a six-hour flight. Your suitcase has developed a bad wheel. Your phone is at nine percent. You haven't eaten anything resembling a proper meal since breakfast."
      },
      {
        "t": "p",
        "text": "And then the lobby smells incredible."
      },
      {
        "t": "p",
        "text": "Suddenly, you are a person who travels well."
      },
      {
        "t": "p",
        "text": "This transformation is one of the quieter achievements of luxury hospitality. Hotels spend enormous sums designing what guests can see: marble floors, custom furniture, dramatic flower arrangements. But one of the most persuasive elements of the experience is something you can't photograph."
      },
      {
        "t": "p",
        "text": "The smell."
      },
      {
        "t": "h",
        "text": "The EDITION Effect"
      },
      {
        "t": "p",
        "text": "Take EDITION Hotels, the luxury brand created with hotelier Ian Schrager."
      },
      {
        "t": "p",
        "text": "At The Miami Beach EDITION, the lobby is a study in controlled tropical abundance. Palms rise above pale seating. Soft lighting settles over the room. The space manages to feel both glamorous and strangely residential, as though an exceptionally wealthy friend has invited you over."
      },
      {
        "t": "p",
        "text": "Another part of the brand's identity is its signature black tea fragrance, developed with Le Labo."
      },
      {
        "t": "p",
        "text": "Black tea is an intriguing choice for a hotel that could have selected almost anything."
      },
      {
        "t": "p",
        "text": "It doesn't immediately suggest the ocean, an expensive bouquet, or a traditional spa. Instead, it occupies a middle ground between familiarity and sophistication."
      },
      {
        "t": "p",
        "text": "The scent combines Sicilian bergamot, black tea, and cedarwood, with a broader composition described through hints of smoke, chocolate, pepper, and florals."
      },
      {
        "t": "p",
        "text": "Bergamot provides the brightness. Tea introduces a dry, slightly tannic impression. Cedarwood gives the fragrance structure, like a beautiful piece of furniture you notice without knowing why."
      },
      {
        "t": "p",
        "text": "Together, they create the suggestion of a place rather than a specific object."
      },
      {
        "t": "h",
        "text": "Why Hotels Want to Be Remembered"
      },
      {
        "t": "p",
        "text": "The interesting part of a signature scent isn't simply that it smells pleasant."
      },
      {
        "t": "p",
        "text": "It's that it can become recognizable."
      },
      {
        "t": "p",
        "text": "A distinctive fragrance gives a hotel another way to maintain a relationship with its guests after checkout. A familiar aroma encountered months later might bring back the lobby, the vacation, or the version of yourself who wasn't answering emails that weekend."
      },
      {
        "t": "p",
        "text": "This is the premise behind scent branding: atmosphere can become part of brand identity."
      },
      {
        "t": "p",
        "text": "It's also an unusually intimate form of marketing. A hotel's logo stays on its stationery. Its fragrance can follow you into your own home."
      },
      {
        "t": "p",
        "text": "EDITION makes that transition quite literal. Through Marriott's retail collection, guests can purchase candles and bath products featuring the brand's signature scent."
      },
      {
        "t": "p",
        "text": "The lobby, in other words, has a gift shop without needing to look like one."
      },
      {
        "t": "h",
        "text": "Can You Actually Buy the Feeling?"
      },
      {
        "t": "p",
        "text": "Here's where things get interesting."
      },
      {
        "t": "p",
        "text": "A black tea candle isn't going to reproduce a luxury hotel. There will be no concierge, no fresh towels appearing mysteriously, and certainly nobody volunteering to carry your suitcase upstairs."
      },
      {
        "t": "p",
        "text": "But fragrance can isolate one small element of the experience."
      },
      {
        "t": "p",
        "text": "Light the candle beside a neatly made bed, remove the laundry from the chair, and suddenly your bedroom may feel more considered."
      },
      {
        "t": "p",
        "text": "Not necessarily richer. Just more intentional."
      },
      {
        "t": "p",
        "text": "Perhaps luxury is partly a matter of noticing the details we ordinarily overlook."
      }
    ],
    "tryThis": {
      "title": "The Five-Star Room Experiment",
      "paras": [
        "Strip your bed and put on clean sheets. Clear your bedside table, leaving only a lamp, a book, and a glass of water.",
        "Place a black tea-scented candle on a stable, heat-resistant surface, away from the bedding, and light it while you're in the room.",
        "Notice what changes when scent is introduced after the visual clutter disappears."
      ]
    },
    "takeHome": {
      "name": "EDITION Signature Black Tea Candle",
      "paras": [
        "The hotel's actual branded candle offers a combination of bergamot, black tea, and cedarwood in a black glazed vessel.",
        "It's a souvenir without a skyline printed on it.",
        "And unlike a hotel minibar, it's something you might genuinely want to use every day."
      ]
    },
    "object": {
      "name": "EDITION Signature Black Tea Candle",
      "notes": "Sicilian Bergamot · Black Tea · Cedarwood",
      "meta": "$80 · 6.7 oz · Marriott Bonvoy Boutiques · Official EDITION product",
      "href": "https://shop.marriott.com/brands/edition/candles/edition-candle/EDT-600-01-BK-7.html",
      "cta": "Explore the candle"
    },
    "references": [
      {
        "before": "EDITION Hotels. (n.d.).",
        "label": "The Miami Beach EDITION: Photo gallery",
        "href": "https://www.editionhotels.com/miami-beach/gallery/",
        "after": ". Official hotel imagery and interior environment."
      },
      {
        "before": "Marriott International. (n.d.).",
        "label": "Shop EDITION Hotels",
        "href": "https://shop.marriott.com/brands/edition.html",
        "after": ". Brand home collection."
      },
      {
        "before": "Marriott International. (n.d.).",
        "label": "EDITION Candle",
        "href": "https://shop.marriott.com/brands/edition/candles/edition-candle/EDT-600-01-BK-7.html",
        "after": ". Official composition, vessel, size, and price."
      },
      {
        "before": "Marriott International. (n.d.).",
        "label": "EDITION Scent Set",
        "href": "https://shop.marriott.com/shop/bundles/scent-bundles/EDT-050-003-SCENT.html",
        "after": ". Confirms the EDITION x Le Labo black tea fragrance collection."
      }
    ]
  },
  {
    "slug": "christmas-smells-like-a-trade-route",
    "topic": "Seasons",
    "families": [
      "spicy",
      "citrus"
    ],
    "fallback": "pomander",
    "date": "2026-11-10",
    "image": {
      "src": "https://collectionapi.metmuseum.org/api/collection/v1/iiif/196980/1679616/main-image",
      "alt": "Pomander, German, 16th century",
      "credit": "The Metropolitan Museum of Art, The Collection of Giovanni P. Morosini, presented by his daughter Giulia, 1932 (32.75.45). Public domain",
      "creditHref": "https://www.metmuseum.org/art/collection/search/196980"
    },
    "objectImage": null,
    "kicker": "History of Scent",
    "readTime": "5 min read",
    "title": "Christmas Smells Like a Trade Route",
    "dek": "How oranges, medieval perfume, and a little Victorian nostalgia created the holiday scent we know today.",
    "blocks": [
      {
        "t": "p",
        "text": "Imagine Christmas without cinnamon."
      },
      {
        "t": "p",
        "text": "No gingerbread candles. No orange-and-clove simmer pots. No pine-scented everything. Just a cold December afternoon and the smell of whatever happens to be cooking."
      },
      {
        "t": "p",
        "text": "It feels almost wrong."
      },
      {
        "t": "p",
        "text": "The modern American Christmas has a remarkably specific scent: evergreen branches, warm spices, citrus peel, and something vaguely resembling freshly baked cookies."
      },
      {
        "t": "p",
        "text": "We recognize this combination so immediately that it's easy to assume Christmas has always smelled this way."
      },
      {
        "t": "p",
        "text": "It hasn't."
      },
      {
        "t": "p",
        "text": "In fact, much of what we think of as the smell of Christmas is the result of centuries of international trade, changing fashions, and some very effective marketing."
      },
      {
        "t": "h",
        "text": "When an Orange Was a Luxury Gift"
      },
      {
        "t": "p",
        "text": "Consider the humble orange."
      },
      {
        "t": "p",
        "text": "Today, you can buy a bag of them at practically any grocery store. But in 19th-century Europe, fresh citrus was an exciting winter luxury, especially for families without much money."
      },
      {
        "t": "p",
        "text": "An orange tucked into a Christmas stocking wasn't a disappointing substitute for a proper present. It could be the present."
      },
      {
        "t": "p",
        "text": "The tradition also became popular in America, where oranges were sometimes associated with Saint Nicholas's legendary gifts of gold. By the early 20th century, California citrus growers were actively promoting oranges as Christmas gifts."
      },
      {
        "t": "p",
        "text": "What we now consider an ordinary fruit once represented something extraordinary: sunshine delivered in the middle of winter."
      },
      {
        "t": "p",
        "text": "There's a lovely contradiction here. The fruit we associate with warmth became part of a holiday celebrated during the coldest season."
      },
      {
        "t": "h",
        "text": "The Medieval Ancestor of Your Holiday Candle"
      },
      {
        "t": "p",
        "text": "Now add cloves."
      },
      {
        "t": "p",
        "text": "Long before scented candles became a lifestyle category, Europeans carried small aromatic objects called pomanders."
      },
      {
        "t": "p",
        "text": "Some were elaborate metal containers filled with fragrant materials. A 16th-century German example in the Metropolitan Museum of Art has separate compartments for cinnamon, nutmeg, rosemary, clove, and other substances."
      },
      {
        "t": "p",
        "text": "People believed these powerful aromas could help protect them from unhealthy air and disease. That medical theory was mistaken, but the objects reveal how highly fragrance was valued."
      },
      {
        "t": "p",
        "text": "The familiar Christmas craft of sticking whole cloves into an orange belongs to a later tradition. It borrows the pomander's basic idea: an ordinary object transformed into something fragrant."
      },
      {
        "t": "p",
        "text": "An orange covered in cloves is wonderfully low-tech. No electricity, no wick, no complicated instructions."
      },
      {
        "t": "p",
        "text": "Just a fruit that smells increasingly like December."
      },
      {
        "t": "h",
        "text": "How the Forest Came Indoors"
      },
      {
        "t": "p",
        "text": "Evergreen trees contribute another part of the story."
      },
      {
        "t": "p",
        "text": "Decorated Christmas trees developed through German traditions and became increasingly popular in American homes during the 19th century."
      },
      {
        "t": "p",
        "text": "Their smell made winter nature part of domestic life."
      },
      {
        "t": "p",
        "text": "Fresh fir and pine introduce green, resinous, woody notes: a useful contrast to the sweetness of oranges and baking spices."
      },
      {
        "t": "p",
        "text": "Put them together, and you get an aromatic combination that feels familiar even when individual households celebrate Christmas very differently."
      },
      {
        "t": "p",
        "text": "It's a kind of cultural shorthand, developed over generations."
      },
      {
        "t": "p",
        "text": "Today, fragrance companies can reproduce that atmosphere in a candle containing mandarin, cloves, cinnamon, and pine."
      },
      {
        "t": "p",
        "text": "The recipe is modern. The associations are much older."
      }
    ],
    "tryThis": {
      "title": "Make a Christmas Pomander",
      "paras": [
        "Take one fresh orange and a handful of whole cloves.",
        "Using a toothpick, make small holes in the peel. Press the cloves into a spiral, a star, or whatever pattern you like.",
        "Place the finished orange on a dish with a few evergreen sprigs. Smell it immediately, then revisit it over the next few days. Check for spoilage and discard it if mold appears.",
        "The citrus is bright and cheerful at first. Gradually, the warm, spicy scent of the cloves becomes more noticeable.",
        "You've made a piece of holiday decoration with ingredients that once traveled enormous distances to reach European households."
      ]
    },
    "takeHome": {
      "name": "NEST New York — Holiday Classic Candle",
      "paras": [
        "With pomegranate, mandarin orange, pine, cloves, cinnamon, and touches of vanilla and amber, NEST's Holiday fragrance brings the familiar elements of Christmas together in one composition.",
        "It's a modern interpretation of a scent story centuries in the making.",
        "Sometimes the most nostalgic thing in a room is also the most historically complicated."
      ]
    },
    "object": {
      "name": "NEST New York — Holiday Classic Candle",
      "notes": "Pomegranate · Mandarin Orange · Pine · Cloves · Cinnamon · Vanilla · Amber",
      "meta": "$52 listed in NEST's current catalog",
      "href": "https://www.nestnewyork.com/products/holiday-classic-candle-2",
      "cta": "Discover the candle"
    },
    "references": [
      {
        "before": "The Metropolitan Museum of Art. (n.d.).",
        "label": "Pomander, German, 16th century",
        "href": "https://www.metmuseum.org/art/collection/search/196980",
        "after": ". Object 32.75.45; historical aromatic containers, ingredients, and medicinal associations."
      },
      {
        "before": "Mansky, J. (2018, December 21).",
        "label": "Why we should bring back the tradition of the Christmas orange",
        "href": "https://www.smithsonianmag.com/arts-culture/why-we-should-bring-back-tradition-christmas-orange-180971101/",
        "after": ". *Smithsonian Magazine*. Citrus gifts, stockings, and American advertising."
      },
      {
        "before": "HISTORY.com Editors. (2023, November 28; updated 2026, September 11).",
        "label": "History of Christmas trees",
        "href": "https://www.history.com/articles/history-of-christmas-trees",
        "after": ". German traditions and their spread into American homes."
      },
      {
        "before": "NEST New York. (n.d.).",
        "label": "Holiday Classic Candle",
        "href": "https://www.nestnewyork.com/products/holiday-classic-candle-2",
        "after": ". Official product page and key scent notes."
      },
      {
        "before": "NEST New York. (n.d.).",
        "label": "Official product catalog",
        "href": "https://www.nestnewyork.com/products",
        "after": ". Lists the Holiday Classic Candle at $52."
      }
    ]
  }
];

export const articleBySlug = (slug: string): Article | undefined => ARTICLES.find((a) => a.slug === slug);
