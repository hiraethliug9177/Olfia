import type { FamilyId } from "@/lib/types";

/**
 * The Olfia Edit — articles. Text, images, credits and references are Tiffany's: three from her file
 * "The Edit — Three Articles" (2026-11-09), four from "THE EDIT — New Editorial Stories" and twelve
 * from "THE EDIT — Twelve New Editorial Features" (both 2026-11-10), converted without rewording. Inline *italics* and **bold** are kept as she wrote
 * them and rendered by components/edit/Rich.tsx.
 * Images are linked from their sources with credit, for the academic prototype (the four new covers
 * are Unsplash photographs from the galleries she linked); each article has a drawn fallback cover in
 * components/edit/ArticleCover.tsx if the source stops serving it.
 * Dates and read counts are sample figures for the prototype (Tiffany 11/10: show the tracking
 * system as it would work); replace them with real numbers once the site has analytics.
 */

export type Topic = "Culture" | "History" | "Science" | "Design" | "Places" | "Rituals";

export interface ArticleImage { src: string; alt: string; credit: string; creditHref?: string }
export type Fallback = "pool" | "lobby" | "pomander" | "books" | "rain" | "tomato" | "vanilla" | "families";
export type Block = { t: "h" | "p"; text: string };

export interface Article {
  slug: string;
  topic: Topic;
  kicker: string;
  readTime: string;
  /** ISO date, yyyy-mm-dd */
  date: string;
  /** sample read count for the prototype */
  views: number;
  title: string;
  dek: string;
  families: FamilyId[];
  image: ArticleImage | null;
  fallback: Fallback;
  blocks: Block[];
  tryThis: { title: string; paras: string[] };
  takeHome: { name: string; paras: string[] };
  object: { name: string; notes?: string; meta?: string; href?: string; cta?: string };
  objectImage: ArticleImage | null;
  references: Array<{ before: string; label?: string; href?: string; after?: string }>;
}

export const TOPICS: Topic[] = ["Culture", "History", "Science", "Design", "Places", "Rituals"];

/** Stories for this time of year, shown in the side rail. */
export const IN_SEASON = ["christmas-smells-like-a-trade-route", "vanilla-is-anything-but-basic", "incense-timekeeping"];

export const ARTICLES: Article[] = [
  {
    "slug": "if-barbie-land-had-a-smell",
    "topic": "Culture",
    "families": [
      "citrus",
      "fresh"
    ],
    "fallback": "pool",
    "date": "2026-11-03",
    "views": 5820,
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
    "date": "2026-10-30",
    "views": 4610,
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
    "topic": "History",
    "families": [
      "spicy",
      "citrus"
    ],
    "fallback": "pomander",
    "date": "2026-11-10",
    "views": 3480,
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
  },
  {
    "slug": "the-secret-life-of-old-books",
    "topic": "Culture",
    "families": [
      "woody",
      "gourmand"
    ],
    "fallback": "books",
    "date": "2026-10-23",
    "views": 2760,
    "image": {
      "src": "https://images.unsplash.com/photo-1671612428381-a9688c4c39bf?auto=format&fit=crop&w=1600&q=80",
      "alt": "A bookshop with a large arched window",
      "credit": "Photo by Annie Spratt on Unsplash",
      "creditHref": "https://unsplash.com/photos/a-book-store-with-a-large-arched-window-f07ZbfBXrfU"
    },
    "objectImage": null,
    "kicker": "Books, Memory & Material Culture",
    "readTime": "3 min read",
    "title": "The Secret Life of Old Books (And Why They Smell So Good)",
    "dek": "On paper chemistry, the romance of secondhand bookstores, and our strange affection for things that are falling apart.",
    "blocks": [
      {
        "t": "p",
        "text": "Walk into a secondhand bookstore and something happens before you've read a single title."
      },
      {
        "t": "p",
        "text": "There's the dust, certainly. Perhaps a little leather, old wood, and whatever the previous owner of a 1974 paperback was eating while reading it. But underneath everything is that unmistakable fragrance of aging paper."
      },
      {
        "t": "p",
        "text": "A smell so universally loved that people have tried to bottle it."
      },
      {
        "t": "p",
        "text": "Which raises an excellent question: **What, exactly, are we smelling?**"
      },
      {
        "t": "h",
        "text": "A Library Is a Very Slow Chemical Experiment"
      },
      {
        "t": "p",
        "text": "In 2009, researchers published a study in *Analytical Chemistry* investigating the volatile compounds released as historic paper deteriorates."
      },
      {
        "t": "p",
        "text": "The findings were surprisingly poetic."
      },
      {
        "t": "p",
        "text": "Among the substances associated with aging paper were furfural and acetic acid, along with a more complicated collection of compounds produced by the breakdown of materials such as lignin."
      },
      {
        "t": "p",
        "text": "The resulting aroma can suggest grassy notes, acidity, vanilla, and mustiness."
      },
      {
        "t": "p",
        "text": "In other words, the smell we romantically associate with literature is partly the smell of paper slowly decomposing."
      },
      {
        "t": "p",
        "text": "There is something wonderfully contradictory about that."
      },
      {
        "t": "p",
        "text": "We preserve old books because we want their contents to survive. Yet one of their most beloved characteristics is evidence that the physical object isn't going to last forever."
      },
      {
        "t": "p",
        "text": "A book is both a container for something permanent and an object in the process of disappearing."
      },
      {
        "t": "h",
        "text": "Can You Manufacture Nostalgia?"
      },
      {
        "t": "p",
        "text": "Fragrance houses have been fascinated by this problem."
      },
      {
        "t": "p",
        "text": "Byredo's *Bibliothèque* candle attempts to evoke a library using plum, cinnamon, leather accord, violet, birch woods, patchouli, and vanilla."
      },
      {
        "t": "p",
        "text": "Notice what's missing: paper."
      },
      {
        "t": "p",
        "text": "The fragrance doesn't attempt a literal chemical reconstruction of decaying cellulose. Instead, it reproduces the *idea* of a library: polished wood, leather bindings, a little sweetness, something dark and pleasantly secluded."
      },
      {
        "t": "p",
        "text": "And that may be a more sophisticated approach."
      },
      {
        "t": "p",
        "text": "After all, the experience of a library is hardly limited to its books. It includes the silence, the architecture, the feeling of time moving differently, and the possibility of finding something you didn't know you were looking for."
      },
      {
        "t": "p",
        "text": "Fragrance doesn't need to reproduce an object perfectly to reproduce its atmosphere."
      },
      {
        "t": "h",
        "text": "The Last Good Place to Get Lost"
      },
      {
        "t": "p",
        "text": "There's another reason bookstores feel increasingly precious."
      },
      {
        "t": "p",
        "text": "Much of our daily reading happens through screens designed to help us find exactly what we already want."
      },
      {
        "t": "p",
        "text": "A used bookstore offers the opposite experience. Its inventory is wonderfully disorganized from the perspective of an algorithm."
      },
      {
        "t": "p",
        "text": "You might enter looking for Joan Didion and leave with a strange cookbook, three postcards, and a novel by somebody you've never heard of."
      },
      {
        "t": "p",
        "text": "You didn't know you wanted any of them."
      },
      {
        "t": "p",
        "text": "Maybe that's part of what an old book smells like: the possibility of discovering something by accident."
      }
    ],
    "tryThis": {
      "title": "A Two-Book Experiment",
      "paras": [
        "Find one relatively new book and one older book. Open each somewhere in the middle and gently waft the air near its pages toward you.",
        "Compare the smells. Does one seem sharper, sweeter, dustier, or more woody?",
        "Avoid deliberately inhaling dust from visibly moldy or damaged books."
      ]
    },
    "takeHome": {
      "name": "Byredo — Bibliothèque Candle",
      "paras": [
        "An atmospheric interpretation of an old library built around leather, plum, violet, woods, and vanilla.",
        "It won't make your books older. It might make the act of reading feel a little more ceremonial."
      ]
    },
    "object": {
      "name": "Byredo — Bibliothèque Candle",
      "notes": "Leather · Plum · Violet · Vanilla",
      "href": "https://www.byredo.com/us_en/p/bibliotheque-candle",
      "cta": "Discover the candle"
    },
    "references": [
      {
        "before": "Strlič, M., et al. (2009).",
        "label": "Material degradomics: On the smell of old books",
        "href": "https://doi.org/10.1021/ac9016049",
        "after": ". *Analytical Chemistry, 81*(20), 8617–8622."
      },
      {
        "before": "",
        "label": "Assessment of volatile emissions by aging books",
        "href": "https://pubmed.ncbi.nlm.nih.gov/37227637/",
        "after": " (2023). A comparative study of chemicals emitted by books of different ages."
      },
      {
        "before": "Byredo.",
        "label": "Bibliothèque candle and fragrance notes",
        "href": "https://www.byredo.com/us_en/p/bibliotheque-candle",
        "after": "."
      }
    ]
  },
  {
    "slug": "why-does-the-world-smell-better-after-it-rains",
    "topic": "Science",
    "families": [
      "fresh",
      "green"
    ],
    "fallback": "rain",
    "date": "2026-11-06",
    "views": 2140,
    "image": {
      "src": "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&q=80",
      "alt": "A city street with puddles of water on the ground",
      "credit": "Photo by Dyana Wing So on Unsplash",
      "creditHref": "https://unsplash.com/photos/a-city-street-with-puddles-of-water-on-the-ground-0hRqCOhZnM8"
    },
    "objectImage": null,
    "kicker": "Science, Weather & Urban Life",
    "readTime": "4 min read",
    "title": "Why Does the World Smell Better After It Rains?",
    "dek": "The science of petrichor, the strange chemistry of wet pavement, and the case for a candle that smells like a thunderstorm.",
    "blocks": [
      {
        "t": "p",
        "text": "There's a moment during a summer thunderstorm when a city becomes briefly unrecognizable."
      },
      {
        "t": "p",
        "text": "The sidewalks darken. Traffic sounds different. Steam rises from the asphalt. And suddenly the whole place smells like something you can't quite name."
      },
      {
        "t": "p",
        "text": "Earth, perhaps. Concrete. Grass. Something clean and vaguely electric."
      },
      {
        "t": "p",
        "text": "We've all experienced it. But the smell of rain is rather more complicated than water falling from the sky."
      },
      {
        "t": "p",
        "text": "In fact, rain itself is barely the interesting part."
      },
      {
        "t": "h",
        "text": "The Smell Has a Name"
      },
      {
        "t": "p",
        "text": "Petrichor."
      },
      {
        "t": "p",
        "text": "The term was introduced by Australian researchers Isabel Joy Bear and Richard Thomas in 1964 to describe the distinctive earthy scent associated with rain after a dry period."
      },
      {
        "t": "p",
        "text": "One important contributor is geosmin, an aromatic compound produced by certain soil microorganisms."
      },
      {
        "t": "p",
        "text": "Humans are remarkably sensitive to it. Even at very low concentrations, geosmin can create the impression of damp earth."
      },
      {
        "t": "p",
        "text": "But how does a chemical produced in soil become a fragrance drifting through the air?"
      },
      {
        "t": "p",
        "text": "In 2015, researchers at MIT offered a particularly elegant explanation."
      },
      {
        "t": "p",
        "text": "Using high-speed cameras, they watched raindrops strike porous surfaces. As a drop landed, tiny air bubbles formed underneath it and then burst, releasing microscopic aerosols into the air."
      },
      {
        "t": "p",
        "text": "Some of those aerosols can carry aromatic material from the ground."
      },
      {
        "t": "p",
        "text": "A rainstorm, it turns out, can function like an enormous natural fragrance diffuser."
      },
      {
        "t": "h",
        "text": "Why New York Doesn't Smell Like a Forest"
      },
      {
        "t": "p",
        "text": "If you've ever noticed that rain smells different in a city than it does in the countryside, you're not imagining things."
      },
      {
        "t": "p",
        "text": "The underlying surfaces matter."
      },
      {
        "t": "p",
        "text": "A forest offers soil, moss, bark, and decomposing leaves. A city offers hot asphalt, concrete, weeds growing through cracks, exhaust residues, and the particular warmth of buildings that have spent all afternoon in the sun."
      },
      {
        "t": "p",
        "text": "Rain interrupts both environments, but the resulting aromas are different."
      },
      {
        "t": "p",
        "text": "This distinction inspired the Brooklyn-based fragrance house D.S. & DURGA."
      },
      {
        "t": "p",
        "text": "Its *Concrete After Lightning* candle isn't trying to smell like a mountain waterfall or an expensive spa. Its listed notes include electricity, panic grass, summer rain, ozone, concrete, and steam."
      },
      {
        "t": "p",
        "text": "These are evocative descriptions of a constructed fragrance, not literal ingredients extracted from a thunderbolt."
      },
      {
        "t": "p",
        "text": "Still, it's an unexpectedly persuasive idea."
      },
      {
        "t": "p",
        "text": "For all our enthusiasm for pristine forests and remote beaches, some of the most memorable scents belong to the places where we actually live."
      },
      {
        "t": "p",
        "text": "A subway entrance after rainfall. A hot sidewalk. Grass growing beside a parking lot."
      },
      {
        "t": "p",
        "text": "Not conventionally beautiful. Entirely unforgettable."
      },
      {
        "t": "h",
        "text": "The Weather We Want to Keep"
      },
      {
        "t": "p",
        "text": "There's something almost absurd about buying a candle that smells like rain."
      },
      {
        "t": "p",
        "text": "Rain is free. Occasionally, there's far too much of it."
      },
      {
        "t": "p",
        "text": "Yet you can't schedule the particular moment when an ordinary street transforms into something cinematic."
      },
      {
        "t": "p",
        "text": "A fragrance can bring back a version of that experience without needing to reproduce the weather itself."
      },
      {
        "t": "p",
        "text": "Maybe that's why atmospheric scents are so compelling. They don't smell like objects you want to own."
      },
      {
        "t": "p",
        "text": "They smell like moments you'd like to revisit."
      }
    ],
    "tryThis": {
      "title": "The Rainwalk",
      "paras": [
        "The next time a light rain has passed, take a short walk around your neighborhood.",
        "Find three different surfaces: grass, soil, and pavement.",
        "Without leaning into traffic or touching anything unsafe, notice how the air changes near each one.",
        "You may discover that your neighborhood has several distinct versions of petrichor."
      ]
    },
    "takeHome": {
      "name": "D.S. & DURGA — Concrete After Lightning Candle",
      "paras": [
        "A wonderfully peculiar urban fragrance inspired by wet pavement, ozone, and summer rain.",
        "For anyone who has ever loved the smell of a city immediately after a thunderstorm."
      ]
    },
    "object": {
      "name": "D.S. & DURGA — Concrete After Lightning Candle",
      "notes": "Summer Rain · Ozone · Concrete · Steam",
      "href": "https://www.dsanddurga.com/products/concrete-after-lightning-candle",
      "cta": "Discover the candle"
    },
    "references": [
      {
        "before": "Chu, J. (2015, January 14).",
        "label": "Rainfall can release aerosols, study finds",
        "href": "https://news.mit.edu/2015/rainfall-can-release-aerosols-0114",
        "after": ". *MIT News*."
      },
      {
        "before": "Bear, I. J., & Thomas, R. G. (1964). Nature of argillaceous odour. *Nature, 201*, 993–995."
      },
      {
        "before": "D.S. & DURGA.",
        "label": "Concrete After Lightning: Official fragrance notes",
        "href": "https://www.dsanddurga.com/products/concrete-after-lightning-candle",
        "after": "."
      }
    ]
  },
  {
    "slug": "who-decided-a-tomato-should-be-a-luxury-candle",
    "topic": "Design",
    "families": [
      "green",
      "citrus"
    ],
    "fallback": "tomato",
    "date": "2026-10-16",
    "views": 1540,
    "image": {
      "src": "https://images.unsplash.com/photo-1596199050105-6d5d32222916?auto=format&fit=crop&w=1600&q=80",
      "alt": "Green and red tomatoes on green leaves",
      "credit": "Photo by Justus Menke on Unsplash",
      "creditHref": "https://unsplash.com/photos/green-and-red-tomatoes-on-green-leaves-zRqRhIJqdnI"
    },
    "objectImage": null,
    "kicker": "Design, Luxury & Unexpected Ingredients",
    "readTime": "4 min read",
    "title": "Who Decided a Tomato Should Be a Luxury Candle?",
    "dek": "On LOEWE, the smell of green things, and why the most interesting fragrance in a room might come from the vegetable garden.",
    "blocks": [
      {
        "t": "p",
        "text": "Somewhere along the way, the tomato became fashionable."
      },
      {
        "t": "p",
        "text": "Not the tomato itself, exactly. Nobody is suggesting that a grocery-store Roma tomato belongs in a velvet-lined jewelry box."
      },
      {
        "t": "p",
        "text": "It's the leaves."
      },
      {
        "t": "p",
        "text": "That sharp, green, slightly bitter smell that clings to your fingers after brushing against a tomato plant has found its way into the world of designer home fragrance."
      },
      {
        "t": "p",
        "text": "LOEWE, the Spanish luxury house, sells tomato-leaf candles in handcrafted glazed terracotta vessels, with larger formats costing hundreds of dollars."
      },
      {
        "t": "p",
        "text": "A tomato plant, it turns out, can be quite expensive once you put it in the right container."
      },
      {
        "t": "h",
        "text": "The Part You're Not Supposed to Eat"
      },
      {
        "t": "p",
        "text": "Most people think of tomatoes in terms of flavor: acidity, sweetness, salt, and the satisfaction of a really good summer sandwich."
      },
      {
        "t": "p",
        "text": "But the plant's leaves smell entirely different from its fruit."
      },
      {
        "t": "p",
        "text": "They're intensely green, a little peppery, and sometimes almost medicinal."
      },
      {
        "t": "p",
        "text": "The source is fascinating."
      },
      {
        "t": "p",
        "text": "Tomato leaves and stems are covered with tiny structures called trichomes. Some function as chemical factories, producing and storing volatile compounds that help the plant interact with its environment and defend itself against insects."
      },
      {
        "t": "p",
        "text": "Many of these chemicals contribute to the recognizable fragrance of tomato foliage."
      },
      {
        "t": "p",
        "text": "In other words, the smell we find so charming is partly the result of a plant's rather sophisticated defense system."
      },
      {
        "t": "p",
        "text": "Nature doesn't always produce beautiful fragrances for our enjoyment. Sometimes beauty is simply a side effect."
      },
      {
        "t": "h",
        "text": "Why Green Smells Expensive"
      },
      {
        "t": "p",
        "text": "What makes tomato leaf particularly interesting as a luxury fragrance is that it rejects several familiar ideas about what a beautiful home should smell like."
      },
      {
        "t": "p",
        "text": "It isn't especially sweet. It doesn't suggest fresh laundry, vanilla cupcakes, or a tropical vacation."
      },
      {
        "t": "p",
        "text": "Instead, it smells like something living."
      },
      {
        "t": "p",
        "text": "LOEWE's Tomato Leaves candle interprets this character through a fresh, verdant composition with delicate hints of cassis."
      },
      {
        "t": "p",
        "text": "The brand presents it in a glazed terracotta vessel that looks almost as important as the fragrance itself."
      },
      {
        "t": "p",
        "text": "There's a clever relationship between the two: an earthy, botanical smell housed in a material associated with pottery and gardens."
      },
      {
        "t": "p",
        "text": "The candle becomes more than a source of fragrance. It's an object that suggests a particular lifestyle, even when unlit."
      },
      {
        "t": "p",
        "text": "A window open to the garden. A wooden table. A kitchen where somebody actually cooks."
      },
      {
        "t": "p",
        "text": "Of course, owning the candle doesn't guarantee any of these things."
      },
      {
        "t": "p",
        "text": "That's the little joke at the center of luxury home fragrance: we sometimes purchase the atmosphere of activities we don't actually have time to do."
      },
      {
        "t": "h",
        "text": "A Garden Without the Gardening"
      },
      {
        "t": "p",
        "text": "The appeal of tomato leaves may also reflect a broader desire for interiors that feel less polished and more alive."
      },
      {
        "t": "p",
        "text": "A perfectly clean room can be strangely anonymous."
      },
      {
        "t": "p",
        "text": "Add an herb pot, a bowl of lemons, or a tomato vine on the windowsill, and the room acquires a sense of season and place."
      },
      {
        "t": "p",
        "text": "Green fragrance works similarly. It introduces something unexpected into an otherwise controlled environment."
      },
      {
        "t": "p",
        "text": "And unlike a vase of roses, it doesn't have to be conventionally romantic."
      },
      {
        "t": "p",
        "text": "Perhaps the most interesting thing about the tomato-leaf candle is its willingness to smell slightly strange."
      }
    ],
    "tryThis": {
      "title": "The Tomato Leaf Test",
      "paras": [
        "Find a tomato plant at a farmers market or garden center.",
        "Gently brush one leaf between your fingers, then smell your fingertips.",
        "Next, smell a ripe tomato.",
        "Notice how surprisingly little the two scents have in common. Wash your hands afterward and avoid tasting the foliage."
      ]
    },
    "takeHome": {
      "name": "LOEWE — Tomato Leaves Candle",
      "paras": [
        "A green, botanical candle in sculptural terracotta, designed to evoke the aroma of tomato vines before the fruit ripens.",
        "For people who prefer their homes to smell like gardens rather than desserts."
      ]
    },
    "object": {
      "name": "LOEWE — Tomato Leaves Candle",
      "notes": "Tomato Vines · Green Leaves · Cassis",
      "href": "https://www.perfumesloewe.com/int/en_US/home-scents/tomato-leaves/medium-tomato-leaves-candle-LW67744.html",
      "cta": "Discover the candle"
    },
    "references": [
      {
        "before": "Flood, P. J. (2019).",
        "label": "The smell of transcription: The SlMYC1 transcription factor makes tomato plants smelly",
        "href": "https://doi.org/10.1105/tpc.19.00044",
        "after": ". *The Plant Cell, 31*(1), 2."
      },
      {
        "before": "",
        "label": "Volatile organic compounds in *Solanum lycopersicum* leaves and their roles in plant protection",
        "href": "https://doi.org/10.1093/hr/uhaf181",
        "after": ". (2025). *Horticulture Research, 12*(10)."
      },
      {
        "before": "LOEWE Perfumes.",
        "label": "Tomato Leaves Candle: Product description",
        "href": "https://www.perfumesloewe.com/int/en_US/home-scents/tomato-leaves/medium-tomato-leaves-candle-LW67744.html",
        "after": "."
      }
    ]
  },
  {
    "slug": "vanilla-is-anything-but-basic",
    "topic": "History",
    "families": [
      "gourmand",
      "spicy"
    ],
    "fallback": "vanilla",
    "date": "2026-10-27",
    "views": 1930,
    "image": {
      "src": "https://images.unsplash.com/photo-1592788174877-3f99727fd23d?auto=format&fit=crop&w=1600&q=80",
      "alt": "A vanilla bean on a yellow background",
      "credit": "Photo by Jocelyn Morales on Unsplash",
      "creditHref": "https://unsplash.com/photos/brown-stick-on-yellow-background-TYA9f8hYEX4"
    },
    "objectImage": null,
    "kicker": "Food, History & Global Culture",
    "readTime": "4 min read",
    "title": "Vanilla Is Anything But Basic",
    "dek": "The orchid, the enslaved boy, and the extraordinary history behind the world's most ordinary flavor.",
    "blocks": [
      {
        "t": "p",
        "text": "Vanilla has a public-relations problem."
      },
      {
        "t": "p",
        "text": "We use the word to describe things that are plain, predictable, or lacking imagination."
      },
      {
        "t": "p",
        "text": "A vanilla personality. A vanilla apartment. Vanilla as the safe choice when nobody can agree on ice cream."
      },
      {
        "t": "p",
        "text": "Which is unfortunate, because vanilla has one of the most extraordinary histories of any aromatic ingredient."
      },
      {
        "t": "p",
        "text": "It's an orchid. It helped shape international trade. Its cultivation was transformed by the discovery of an enslaved child. And producing it can require months of patient agricultural work."
      },
      {
        "t": "p",
        "text": "There is nothing remotely basic about it."
      },
      {
        "t": "h",
        "text": "The Orchid Nobody Recognizes"
      },
      {
        "t": "p",
        "text": "Vanilla comes from the fruit of a climbing tropical orchid, most famously *Vanilla planifolia*."
      },
      {
        "t": "p",
        "text": "Its flowers are pale, delicate, and rather beautiful. Each individual blossom generally opens for less than a day."
      },
      {
        "t": "p",
        "text": "The plant originated in Mexico and was cultivated and used by Indigenous peoples long before Europeans encountered it."
      },
      {
        "t": "p",
        "text": "Following Spanish colonization, vanilla traveled to Europe, where it became fashionable in food, perfume, and other luxury products."
      },
      {
        "t": "p",
        "text": "There was one major problem: growing vanilla outside its native environment was difficult."
      },
      {
        "t": "p",
        "text": "The orchids could flourish and produce flowers, but without successful pollination, they wouldn't produce the valuable seed pods."
      },
      {
        "t": "p",
        "text": "For decades, that problem limited large-scale cultivation elsewhere."
      },
      {
        "t": "h",
        "text": "The Boy Who Changed Vanilla Forever"
      },
      {
        "t": "p",
        "text": "In 1841, on the island of Réunion, a 12-year-old enslaved boy named Edmond Albius developed a practical method of hand-pollinating vanilla flowers."
      },
      {
        "t": "p",
        "text": "Using a small tool to manipulate the flower's reproductive structures, he made it possible to pollinate the orchids efficiently by hand."
      },
      {
        "t": "p",
        "text": "His discovery transformed vanilla cultivation and helped establish production across new tropical growing regions."
      },
      {
        "t": "p",
        "text": "Albius never received compensation proportionate to the global industry his technique made possible."
      },
      {
        "t": "p",
        "text": "It's an extraordinary reminder that even the most familiar household ingredients can carry histories of colonialism, labor, and unequal rewards."
      },
      {
        "t": "p",
        "text": "Today, much of the world's natural vanilla comes from Madagascar, where production remains labor-intensive."
      },
      {
        "t": "p",
        "text": "The flowers must be pollinated within a narrow window. The pods take months to mature, and harvesting is followed by a lengthy curing process that develops their characteristic aroma."
      },
      {
        "t": "p",
        "text": "A bottle of vanilla extract looks like an ordinary grocery purchase."
      },
      {
        "t": "p",
        "text": "The work behind it is anything but ordinary."
      },
      {
        "t": "h",
        "text": "Why Vanilla Smells Like Comfort"
      },
      {
        "t": "p",
        "text": "Vanillin is one of the principal compounds responsible for vanilla's recognizable aroma."
      },
      {
        "t": "p",
        "text": "But the scent of a cured vanilla pod is more complex than vanillin alone. It can contain woody, smoky, spicy, and balsamic nuances."
      },
      {
        "t": "p",
        "text": "This complexity helps explain why vanilla appears in so many different fragrance styles."
      },
      {
        "t": "p",
        "text": "In a gourmand candle, it can suggest birthday cakes and warm kitchens."
      },
      {
        "t": "p",
        "text": "Combined with woods, resins, or smoke, it can feel darker, drier, and more contemplative."
      },
      {
        "t": "p",
        "text": "Vanilla doesn't necessarily smell childish or sugary. Often, that's simply the version we've been taught to recognize."
      },
      {
        "t": "h",
        "text": "The Most Familiar Smell in the World"
      },
      {
        "t": "p",
        "text": "Maybe it's time to reconsider the word *vanilla*."
      },
      {
        "t": "p",
        "text": "An ingredient doesn't become ordinary because its story is simple. Sometimes it becomes ordinary because its story has been so thoroughly forgotten."
      },
      {
        "t": "p",
        "text": "The next time you encounter vanilla in a fragrance, try to imagine the orchid rather than the ice cream."
      },
      {
        "t": "p",
        "text": "It's a completely different experience."
      }
    ],
    "tryThis": {
      "title": "Meet the Real Ingredient",
      "paras": [
        "Find a whole vanilla bean at a grocery store or specialty food shop.",
        "Smell it before opening the package fully. Then split it lengthwise and gently scrape out a small portion of the seeds.",
        "Compare the aroma with a bottle of vanilla extract.",
        "Notice the differences in sweetness, woodiness, and complexity. Save the seeds for baking."
      ]
    },
    "takeHome": {
      "name": "Whole Vanilla Beans",
      "paras": [
        "Not every editorial recommendation needs to be a luxury purchase.",
        "For this story, an actual vanilla bean is the most meaningful object to bring home.",
        "Store it in a tightly sealed container in a cool, dark place. Once you've explored the aroma, use it to flavor a homemade dessert.",
        "Sometimes the best way to understand a fragrance is to meet the ingredient before it becomes one."
      ]
    },
    "object": {
      "name": "Whole Vanilla Beans",
      "notes": "Botanical Ingredient · Sensory Exploration · Cooking"
    },
    "references": [
      {
        "before": "Smithsonian Gardens.",
        "label": "Orchid innovation: The vanilla orchid",
        "href": "https://gardens.si.edu/exhibitions/connective-power-of-orchids/section-4-orchid-innovation-the-vanilla-orchid/",
        "after": ". Botanical history, pollination, and Edmond Albius."
      },
      {
        "before": "Smithsonian Institution.",
        "label": "Vanilla planifolia",
        "href": "https://www.si.edu/object/vanilla-planifolia%3Aofeo-sg_2007-0281C",
        "after": ". Natural history, cultivation, and economic importance."
      }
    ]
  },
  {
    "slug": "movie-theater-popcorn",
    "topic": "Culture",
    "families": [
      "gourmand",
      "woody"
    ],
    "fallback": "families",
    "date": "2026-11-08",
    "views": 3920,
    "image": {
      "src": "https://images.unsplash.com/photo-1620177088258-c84147ee601f?auto=format&fit=crop&w=1600&q=80",
      "alt": "Popcorn in striped paper bags in a cinema",
      "credit": "Photo by Meg Boulden on Unsplash",
      "creditHref": "https://unsplash.com/photos/popcorn-in-striped-bags-cinema-z0cyJX3WTWI"
    },
    "objectImage": null,
    "kicker": "Culture / Cinema",
    "readTime": "3 min read",
    "title": "Why Every Movie Theater Smells Like Popcorn",
    "dek": "The snack that went from unwelcome guest to Hollywood supporting actor.",
    "blocks": [
      {
        "t": "p",
        "text": "The movie hasn't started. You're still standing in the lobby, deciding whether you can justify paying nearly as much for snacks as you did for admission. Then the smell reaches you: warm, buttery popcorn. The decision, you discover, has already been made."
      },
      {
        "t": "p",
        "text": "It's difficult to imagine an American cinema without popcorn. But for years, movie theaters wanted nothing to do with it. Early movie palaces aimed to resemble respectable theaters, complete with carpets, upholstered seating, and the possibility of a sophisticated audience. Popcorn, sold by street vendors, was cheap, noisy, and messy. Its greatest offense may have been that you could eat it with your hands."
      },
      {
        "t": "h",
        "text": "An Unlikely Leading Man"
      },
      {
        "t": "p",
        "text": "Popcorn's rise was part economics, part technology, and part American history. Mobile popping equipment brought it closer to customers, and the Depression made inexpensive snacks appealing. As cinemas looked for reliable revenue beyond ticket sales, the snack they once discouraged began to look like an excellent business proposition. The concession stand became a small theater inside the theater: a machine making noise, a cloud of aroma, and an audience waiting for something good."
      },
      {
        "t": "p",
        "text": "You can watch this history play out in a modern lobby. Posters promise the spectacle on-screen, but popcorn provides the first sensory preview. Its aroma announces that this is not an ordinary room. You are entering a place where sitting in the dark for two hours is a perfectly respectable plan."
      },
      {
        "t": "p",
        "text": "The familiar buttery smell isn't identical to the aroma of plain popped corn. Movie theaters may use flavored oils, buttery toppings, and seasoning blends to produce the rich experience customers expect. And, as anyone who has tried to recreate multiplex popcorn at home knows, expectation is half the recipe."
      },
      {
        "t": "h",
        "text": "An Edible Soundtrack"
      },
      {
        "t": "p",
        "text": "Why does this work so well? A smell can become closely linked to a situation through repetition. We encounter popcorn at cinemas often enough that the association runs in both directions. A movie can make us want popcorn; popcorn can make a normal Tuesday feel vaguely cinematic."
      },
      {
        "t": "p",
        "text": "That connection also helps explain why popcorn is an unusually successful concession product. It can be made in batches, served quickly, shared or eaten alone, and carried into the auditorium. It doesn't require a plate or a fork. Its crunchy soundtrack is practically inseparable from the opening credits, even if the person beside you may disagree."
      },
      {
        "t": "p",
        "text": "It's worth noticing how few luxury objects are involved here. The cinema experience is built from cheap materials—corn, oil, salt, paper—and transformed by context. Most home fragrances try to make an ordinary room feel expensive. Popcorn does something more democratic: it makes an ordinary room feel like an occasion."
      }
    ],
    "tryThis": {
      "title": "The Opening-Credits Test",
      "paras": [
        "Make a small bowl of popcorn before watching a film at home. First smell the plain popcorn. Then add melted butter or your preferred seasoning, and notice how the aroma changes. Finally dim the lights and start the film. Does the same snack feel different once the ritual is complete?"
      ]
    },
    "takeHome": {
      "name": "Popcorn kernels + a reusable stovetop popper",
      "paras": [
        "Rather than a popcorn-scented candle, take home the genuine thing. A simple popping pot makes the scent and the snack together. Pair it with a paper ticket stub or a handwritten list of films to watch. The object is inexpensive; the feeling is the entire point."
      ]
    },
    "object": {
      "name": "Popcorn kernels + a reusable stovetop popper"
    },
    "references": [
      {
        "before": "",
        "label": "Elizabeth Yuko, “When Movie Theaters Tried to Ban Popcorn,” HISTORY (2026)",
        "href": "https://www.history.com/articles/why-popcorn-is-movie-snack",
        "after": ""
      }
    ]
  },
  {
    "slug": "can-you-smell-a-painting",
    "topic": "History",
    "families": [
      "green",
      "citrus"
    ],
    "fallback": "families",
    "date": "2026-10-02",
    "views": 1680,
    "image": {
      "src": "https://images.unsplash.com/photo-1606819717115-9159c900370b?auto=format&fit=crop&w=1600&q=80",
      "alt": "A visitor standing in front of paintings",
      "credit": "Photo by Zalfa Imani on Unsplash",
      "creditHref": "https://unsplash.com/photos/woman-in-black-coat-standing-in-front-of-paintings-1xp5VxvyKL0"
    },
    "objectImage": null,
    "kicker": "Art / Museums",
    "readTime": "4 min read",
    "title": "Can You Smell a Painting?",
    "dek": "The challenge of giving the past back its missing sense.",
    "blocks": [
      {
        "t": "p",
        "text": "Imagine standing in front of a seventeenth-century painting of a banquet. Silver dishes gleam. A dog waits hopefully beneath the table. Someone has placed flowers next to a platter of fruit. You're invited to look closely at everything except the one thing the guests couldn't possibly ignore: the smell."
      },
      {
        "t": "p",
        "text": "Paintings don't preserve cooking smoke, perfume, damp clothes, or the particular atmosphere of a crowded room. The world's great museums are full of scenes that were once fragrant, unpleasant, or both. They reach us scrubbed clean by time."
      },
      {
        "t": "h",
        "text": "An Invisible Missing Piece"
      },
      {
        "t": "p",
        "text": "The European research project Odeuropa set out to study scents as cultural heritage. Its historians and researchers have traced descriptions of smells in texts and images, investigating how people experienced aromas from rosemary and incense to streets and marketplaces. The premise is more ambitious than adding a pleasant scent to an exhibition. It asks whether fragrance can tell us something that an object label cannot."
      },
      {
        "t": "p",
        "text": "A gallery visitor might recognize a painted orange. But how would its smell have been understood by the original audience? A rare luxury? A familiar food? A sign of trade or status? The molecule may be recognizable while its cultural meaning has changed completely."
      },
      {
        "t": "p",
        "text": "That is why reconstructing a historical scent isn't simply a matter of finding the right essential oil. It requires evidence about materials, practices, location, and language. Even an informed recreation remains an interpretation, much like a period costume made for a historical film."
      },
      {
        "t": "h",
        "text": "The Trouble with Authenticity"
      },
      {
        "t": "p",
        "text": "There is also a danger in using smell as a shortcut. Historical attractions sometimes emphasize spectacularly foul scents: waste, smoke, rotting food. These can be vivid and memorable. But the past wasn't one continuous bad-smelling street. It also contained perfumed gloves, flowers, kitchens, workshops, and elaborate rituals for scenting rooms."
      },
      {
        "t": "p",
        "text": "The interesting question is not whether the past smelled worse than the present. It is whose nose we are imagining. The perfumed room of a wealthy household and the crowded street outside it belonged to the same city, but not the same sensory world."
      },
      {
        "t": "p",
        "text": "A museum that introduces fragrance has to make decisions. Will everyone encounter the scent? Can visitors opt out? What happens to someone sensitive to fragrance? Does a reconstructed smell clarify the history or simply make the display more entertaining?"
      },
      {
        "t": "p",
        "text": "These questions are part of the art, not an obstacle to it."
      },
      {
        "t": "h",
        "text": "Looking with Your Nose"
      },
      {
        "t": "p",
        "text": "Try reading a still-life painting differently. A lemon might imply the bright spray of citrus peel. A polished table may suggest beeswax. A kitchen scene might hold the heat of bread, smoke, onions, or soap. Suddenly the painting has weather, labor, and life outside its frame."
      },
      {
        "t": "p",
        "text": "The point is not to insist you know what the room smelled like. The point is to discover how many things a photograph or painting can't tell you."
      }
    ],
    "tryThis": {
      "title": "A Still-Life in Three Scents",
      "paras": [
        "Choose a public-domain still-life image from a museum's open-access collection. Place three familiar objects beside it—perhaps a lemon, a sprig of rosemary, and a small piece of wood. Smell each separately while examining the image. Which object changes the scene most dramatically for you?"
      ]
    },
    "takeHome": {
      "name": "A small botanical scent kit",
      "paras": [
        "dried rosemary, citrus peel, and a clean cedar block in labeled jars. These aren't guaranteed reconstructions of an artwork. They're tools for learning to look beyond the visible, one material at a time."
      ]
    },
    "object": {
      "name": "A small botanical scent kit"
    },
    "references": [
      {
        "before": "",
        "label": "Odeuropa, Encyclopedia of Smell History and Heritage",
        "href": "https://encyclopedia.odeuropa.eu/",
        "after": ""
      },
      {
        "before": "",
        "label": "Odeuropa, “Historically Themed Attractions”",
        "href": "https://encyclopedia.odeuropa.eu/items/show/22",
        "after": ""
      },
      {
        "before": "",
        "label": "Odeuropa, “About the Encyclopedia”",
        "href": "https://encyclopedia.odeuropa.eu/about",
        "after": ""
      }
    ]
  },
  {
    "slug": "grandmothers-perfume",
    "topic": "History",
    "families": [
      "floral",
      "fresh"
    ],
    "fallback": "families",
    "date": "2026-11-01",
    "views": 4380,
    "image": {
      "src": "https://images.unsplash.com/photo-1615108395437-df128ad79e80?auto=format&fit=crop&w=1600&q=80",
      "alt": "A clear glass perfume bottle with white flowers",
      "credit": "Photo by Camille Paralisan on Unsplash",
      "creditHref": "https://unsplash.com/photos/clear-glass-perfume-bottle-with-white-flowers-LgoehzzFAMA"
    },
    "objectImage": null,
    "kicker": "History / Beauty",
    "readTime": "3 min read",
    "title": "Why Your Grandmother’s Perfume Smells Like Another Era",
    "dek": "The chemistry of changing taste, from sparkling aldehydes to skin scents.",
    "blocks": [
      {
        "t": "p",
        "text": "Someone opens a little glass bottle on a dresser, and the room changes decades. Suddenly there are powder compacts, formal dinners, handbags with clasps, and the version of adulthood you imagined when you were eight."
      },
      {
        "t": "p",
        "text": "We often describe an older perfume as “grandmotherly,” as though it were a property of the ingredients. It isn't. It's a relationship between fragrance, fashion, and memory. A scent can seem old-fashioned because a previous generation made it popular—and because the people who wore it became part of our lives."
      },
      {
        "t": "h",
        "text": "When Perfume Learned to Sparkle"
      },
      {
        "t": "p",
        "text": "Take Chanel No. 5, launched in 1921. Perfumer Ernest Beaux used aldehydes to give a floral composition unusual lift and abstraction. These materials can smell waxy, citrusy, metallic, or brilliantly clean, depending on their structure and concentration. Rather than simply reproducing a bouquet, a perfumer could create something that felt like the idea of flowers."
      },
      {
        "t": "p",
        "text": "Aldehydes did not begin with No. 5. But that perfume helped make them famous. The result became shorthand for a kind of twentieth-century elegance: polished, dramatic, unmistakably composed."
      },
      {
        "t": "p",
        "text": "Later decades developed their own signatures. Some fragrances favored plush florals and powder. Others embraced green sharpness, richer amber effects, or the enormous projection of 1980s perfume. In the 1990s, transparent and unisex styles gained ground. More recent skin-scent trends have made a virtue of understatement, often emphasizing soft musks and a close-to-the-body effect."
      },
      {
        "t": "p",
        "text": "None of these movements replaced the last one entirely. Perfume cupboards don't operate like technology stores, where a new model renders the old one useless. Styles overlap, return, and get rediscovered. Yesterday's unfashionable bottle can become tomorrow's niche obsession."
      },
      {
        "t": "h",
        "text": "The Scent of Someone Else’s Adulthood"
      },
      {
        "t": "p",
        "text": "What changes is the story we tell ourselves about the smell. A powerful floral aldehyde might once have signaled modernity. On a vintage dressing table, the same structure may feel nostalgic. To someone encountering it for the first time today, it could feel startlingly avant-garde."
      },
      {
        "t": "p",
        "text": "The family connection makes everything more complicated. We don't inherit fragrance notes alone. We inherit memories: a hug, a coat collar, a car ride, a particular room. A perfume that seems too much in a department store may feel irreplaceable when you recognize it on an old scarf."
      },
      {
        "t": "p",
        "text": "That's why describing any one scent as permanently “for older women” tells us more about marketing than chemistry. Age has no monopoly on iris, rose, sandalwood, or aldehydes. They belong to whoever wants to wear them."
      },
      {
        "t": "h",
        "text": "Building a Time Machine"
      },
      {
        "t": "p",
        "text": "The most interesting fragrance collection might not organize bottles by brand or price. It might organize them by eras and moods: one sparkling floral, one powdery classic, one green fragrance, one soft modern musk. Smell them side by side and you'll notice shifts in taste as clearly as you would comparing old photographs."
      }
    ],
    "tryThis": {
      "title": "Three Generations, Three Blotters",
      "paras": [
        "Visit a fragrance counter and sample one classic aldehydic floral, one 1990s-style fresh fragrance, and one contemporary skin scent on separate paper strips. Label them, return after fifteen minutes, and ask which one feels most “modern” without looking at the names."
      ]
    },
    "takeHome": {
      "name": "A set of fragrance blotter cards and three small samples",
      "paras": [
        "A miniature scent archive is more useful than a full bottle bought for its reputation. Give your nose a chance to disagree with the decade printed on the label."
      ]
    },
    "object": {
      "name": "A set of fragrance blotter cards and three small samples"
    },
    "references": [
      {
        "before": "",
        "label": "The Perfume Society, “Aldehydes”",
        "href": "https://perfumesociety.org/ingredients-post/aldehydes/",
        "after": ""
      },
      {
        "before": "",
        "label": "The Perfume Society, “Chanel”",
        "href": "https://perfumesociety.org/perfume-house/chanel/",
        "after": ""
      },
      {
        "before": "",
        "label": "Kraft et al., “From Rallet N°1 to Chanel N°5,” Perfumer & Flavorist",
        "href": "https://img.perfumerflavorist.com/files/base/allured/all/document/2007/09/pf.PF_32_10_036_11.pdf",
        "after": ""
      }
    ]
  },
  {
    "slug": "japanese-bathroom",
    "topic": "Rituals",
    "families": [
      "woody",
      "fresh"
    ],
    "fallback": "families",
    "date": "2026-10-20",
    "views": 3340,
    "image": {
      "src": "https://images.unsplash.com/photo-1764057145780-3ba9929822ba?auto=format&fit=crop&w=1600&q=80",
      "alt": "A traditional Japanese hot spring with steam rising",
      "credit": "Photo by waa towaw on Unsplash",
      "creditHref": "https://unsplash.com/photos/traditional-japanese-hot-springs-with-steam-rising-PTa2YyqPc0s"
    },
    "objectImage": null,
    "kicker": "Rituals / Japan",
    "readTime": "4 min read",
    "title": "Why a Japanese Bathroom Smells Different",
    "dek": "Hinoki, bathing, and the wood that changes a room without perfume.",
    "blocks": [
      {
        "t": "p",
        "text": "There is a particular image of a Japanese bath that travels well online: a wooden tub, soft light, a view of trees, and no shampoo bottle in sight. It is so serene that you can almost hear the photographer asking everyone to hide their belongings."
      },
      {
        "t": "p",
        "text": "The image is a fantasy of order. But the materials tell a more interesting story. In some traditional baths, the wood itself contributes to the atmosphere. Hinoki, a Japanese cypress prized for construction and bathing vessels, has a distinctive fragrance that can become more noticeable with warmth and moisture."
      },
      {
        "t": "h",
        "text": "Architecture That Participates"
      },
      {
        "t": "p",
        "text": "A tub made from hinoki is not just a container placed inside a room. It is part of the sensory environment. Wet wood, steam, and heat change how the space feels, and the natural aroma joins the ritual without a scented product announcing itself."
      },
      {
        "t": "p",
        "text": "Japan's long bathing culture is varied: neighborhood sentō, mineral-rich onsen, modern homes, and luxurious inns are different experiences, not interchangeable scenes in a lifestyle advertisement. Not all Japanese bathrooms are made of wood, and not every onsen smells like cypress. Some hot springs have prominent mineral or sulfurous odors; others do not."
      },
      {
        "t": "p",
        "text": "Still, wood has a remarkable ability to make a bath feel connected to a landscape. The Japan National Tourism Organization describes how warmth releases the fragrance of Kiso hinoki used in bath tubs and even rice containers. It is a reminder that a material can produce atmosphere simply by being used."
      },
      {
        "t": "h",
        "text": "Clean Is Not the Same as Perfumed"
      },
      {
        "t": "p",
        "text": "American bathrooms are frequently sold to us through products: fresh-linen room spray, eucalyptus shower tablets, lavender body wash, candles that promise “spa day.” There's nothing wrong with enjoying those things. But they can make us forget that temperature, surfaces, airflow, and habits all shape a room's scent."
      },
      {
        "t": "p",
        "text": "A damp towel left too long can overwhelm a beautiful candle. Fresh air and dry surfaces do quiet work that even an expensive fragrance cannot substitute for."
      },
      {
        "t": "p",
        "text": "The bathing ritual itself also matters. In Japanese bathing customs, people generally wash before entering a shared soaking bath, so the bath is primarily for soaking rather than scrubbing. This separation of washing from immersion creates a different rhythm: first practical care, then rest."
      },
      {
        "t": "p",
        "text": "If a fragrance has a role here, it might be small and deliberate rather than continuous."
      },
      {
        "t": "h",
        "text": "A Material You Notice Slowly"
      },
      {
        "t": "p",
        "text": "Hinoki is sometimes described as woody, fresh, dry, or gently citrus-like. But the most interesting thing about smelling an actual piece of cypress is how quickly those adjectives stop being enough. Your nose will have its own associations."
      },
      {
        "t": "p",
        "text": "Perhaps the object doesn't remind you of Japan at all. Perhaps it reminds you of a pencil box, a new cabinet, or a hike through trees after rain. That's the beauty of a real material: it resists being reduced to branding."
      }
    ],
    "tryThis": {
      "title": "The Three-Minute Bath Reset",
      "paras": [
        "Before your next shower or bath, clear clutter, replace a damp towel, and ventilate the room. Put a small untreated hinoki wood block on a dry shelf away from standing water. Smell the wood before and after the room becomes warm. Don't put concentrated essential oils directly into bathwater."
      ]
    },
    "takeHome": {
      "name": "An untreated hinoki wood block or bath accessory",
      "paras": [
        "Choose a reputable supplier and follow its care instructions to prevent mildew. It's an understated way to bring a botanical material into the room without trying to recreate a fictional luxury ryokan."
      ]
    },
    "object": {
      "name": "An untreated hinoki wood block or bath accessory"
    },
    "references": [
      {
        "before": "",
        "label": "Japan National Tourism Organization, “Walking the Nakasendo Road from Magome to Tsumago”",
        "href": "https://www.japan.travel/en/au/story/walking-nakasendo-road-magome-tsumago/",
        "after": ""
      },
      {
        "before": "",
        "label": "Japan National Tourism Organization, “How to Best Enjoy Japan’s Onsen”",
        "href": "https://www.japan.travel/en/guide/how-to-best-enjoy-onsen/",
        "after": ""
      }
    ]
  },
  {
    "slug": "coffee-smells-better",
    "topic": "Science",
    "families": [
      "gourmand",
      "woody"
    ],
    "fallback": "families",
    "date": "2026-10-25",
    "views": 5210,
    "image": {
      "src": "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1600&q=80",
      "alt": "Coffee, ground coffee and coffee beans from above",
      "credit": "Photo by Nathan Dumlao on Unsplash",
      "creditHref": "https://unsplash.com/photos/flat-lay-photography-of-coffee-latte-ground-coffee-and-coffee-beans-Y3AqmbmtLQI"
    },
    "objectImage": null,
    "kicker": "Food / Everyday Science",
    "readTime": "3 min read",
    "title": "Why Coffee Smells Better Than It Tastes",
    "dek": "Your nose and tongue are having two very different mornings.",
    "blocks": [
      {
        "t": "p",
        "text": "There's a cruel moment in the life of a coffee drinker: the smell of freshly ground beans promises toasted chocolate, warm caramel, and the most competent version of yourself. Then you take the first sip, and it's bitter."
      },
      {
        "t": "p",
        "text": "How can the same coffee be so seductive from a distance and so difficult up close?"
      },
      {
        "t": "p",
        "text": "The answer begins with a small anatomical twist. We don't experience flavor through taste alone. Much of what we call taste involves aromas traveling to the olfactory system from the back of the mouth, a process called retronasal olfaction."
      },
      {
        "t": "h",
        "text": "Two Ways to Smell a Cup"
      },
      {
        "t": "p",
        "text": "When you lift a cup to your face, volatile compounds reach your nose from the outside. That's orthonasal smelling. When you drink, aromas can travel from your mouth toward your nose as you exhale. That's retronasal smelling. Both contribute to your experience, but they interact with different sensations."
      },
      {
        "t": "p",
        "text": "Coffee is especially complicated because it contains a vast assortment of aromatic compounds, while the liquid also delivers bitterness, acidity, astringency, and texture. Before tasting it, your nose may register a welcoming cloud of roasted and sweet-smelling molecules. Once you take a sip, your tongue and mouth begin contributing their own opinions."
      },
      {
        "t": "p",
        "text": "Researchers studying coffee aroma have found that bitter-tasting substances can change the perception of retronasal coffee aromas even when the odor compounds themselves haven't meaningfully changed. The effect is an example of sensory integration: the brain doesn't simply add flavor components together like numbers on a receipt."
      },
      {
        "t": "h",
        "text": "The Story We Tell Ourselves About Coffee"
      },
      {
        "t": "p",
        "text": "This is why coffee descriptions can be both useful and misleading. “Notes of chocolate” doesn't mean chocolate was added. The phrase suggests a sensory resemblance in the roasted bean's aroma and flavor. And two people can disagree about whether that resemblance is obvious."
      },
      {
        "t": "p",
        "text": "Temperature matters, too. A hot cup produces an aromatic plume that changes as the drink cools. A coffee that initially smells assertively roasted may reveal gentler characteristics when it is no longer scalding. Meanwhile, bitterness may become easier to notice without the heat dominating your attention."
      },
      {
        "t": "p",
        "text": "A barista's tasting notes offer a starting point, not an instruction to discover blueberries on command."
      },
      {
        "t": "p",
        "text": "The most interesting shift is to stop asking whether you can taste the officially advertised flavor and start noticing the sequence. What arrives before the sip? What appears while drinking? What stays after swallowing?"
      },
      {
        "t": "h",
        "text": "An Ordinary Luxury"
      },
      {
        "t": "p",
        "text": "You don't need a professional cupping spoon or a countertop appliance capable of launching satellites. A simple cup of freshly brewed coffee provides enough material for a surprisingly rich experiment."
      },
      {
        "t": "p",
        "text": "And perhaps that's the secret behind the appeal of coffee-scented candles. They preserve one wonderful part of the ritual—the warm aromatic introduction—without asking you to confront the bitter consequences."
      }
    ],
    "tryThis": {
      "title": "A Coffee in Three Acts",
      "paras": [
        "Use a coffee you already enjoy. Smell the dry grounds, then the freshly brewed cup. Take a small sip after it reaches a comfortable temperature, and exhale gently through your nose. Note three differences among the experiences. If you dislike coffee, compare dry and brewed decaffeinated coffee without drinking it."
      ]
    },
    "takeHome": {
      "name": "A small bag of freshly roasted coffee beans and a simple grinder",
      "paras": [
        "The grinder is optional; the experiment isn't. Use a paper journal to record aroma, flavor, and aftertaste separately. You're not trying to become a critic. You're teaching yourself how much a familiar cup contains."
      ]
    },
    "object": {
      "name": "A small bag of freshly roasted coffee beans and a simple grinder"
    },
    "references": [
      {
        "before": "",
        "label": "Paravisini et al., “Impact of bitter tastant sub-qualities on retronasal coffee aroma perception,” PLOS ONE (2019)",
        "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6776322/",
        "after": ""
      },
      {
        "before": "",
        "label": "“Ecological quality as a coffee quality enhancer: A review” (2023)",
        "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9894527/",
        "after": ""
      }
    ]
  },
  {
    "slug": "flowers-after-dark",
    "topic": "Science",
    "families": [
      "floral",
      "green"
    ],
    "fallback": "families",
    "date": "2026-09-19",
    "views": 1450,
    "image": {
      "src": "https://images.unsplash.com/photo-1566734568560-e510de3d6da0?auto=format&fit=crop&w=1600&q=80",
      "alt": "White flowers in soft focus",
      "credit": "Photo by Bibi Pace on Unsplash",
      "creditHref": "https://unsplash.com/photos/selective-focus-photography-of-white-petaled-flowers-LzbGmtwt5eY"
    },
    "objectImage": null,
    "kicker": "Botany / Nightlife",
    "readTime": "3 min read",
    "title": "The Flowers That Wait Until Dark",
    "dek": "Night-blooming plants have an audience you rarely see.",
    "blocks": [
      {
        "t": "p",
        "text": "A flower that perfumes the night feels like it must be keeping a secret. All day, the garden seems ordinary. Then, after sunset, a sweet scent drifts through the open window as though somebody has applied perfume to the air."
      },
      {
        "t": "p",
        "text": "It's tempting to call this romantic. For many plants, it's also practical. Fragrance is one way flowers communicate with pollinators, and not every pollinator works the day shift."
      },
      {
        "t": "h",
        "text": "The Night Shift"
      },
      {
        "t": "p",
        "text": "Some night-opening or night-fragrant flowers are adapted to attract moths and other nocturnal visitors. Pale petals can be more visible in low light, and a strong evening scent provides information that doesn't depend on daylight. A plant doesn't need to be seen from across a garden if its aroma can travel on the breeze."
      },
      {
        "t": "p",
        "text": "Different species use different strategies. Not every white flower is moth-pollinated, not every fragrant flower blooms at night, and not every plant marketed as “night jasmine” is a true jasmine. Names like these make wonderful labels, but they can obscure the surprisingly specific biology of each species."
      },
      {
        "t": "p",
        "text": "One favorite example is the night-blooming cereus, a name used for several cactus species whose dramatic flowers may open at night and last only briefly. In other gardens, fragrant tobacco, or *Nicotiana* species and cultivars, may release a noticeable perfume in the evening. The precise behavior depends on the plant and its conditions."
      },
      {
        "t": "p",
        "text": "The point is not that darkness magically makes flowers smell stronger. It's that some plants are tuned to different hours and different visitors."
      },
      {
        "t": "h",
        "text": "Perfume with an Appointment"
      },
      {
        "t": "p",
        "text": "A bottled floral fragrance is available whenever you want it. A living flower has a schedule. This makes encountering its smell feel a little like attending a performance. You show up at the right time and hope the star appears."
      },
      {
        "t": "p",
        "text": "The garden after dark also changes what you notice. Color recedes. Shape becomes less obvious. Sound and temperature take on new importance. A floral scent that would compete with sunlight and visual detail during the afternoon may seem far more prominent at night."
      },
      {
        "t": "p",
        "text": "There's a useful lesson for home fragrance here. We often ask a candle to make a room smell good all day, every day. But a specific scent at a specific time might be more memorable. An evening-only ritual gives fragrance a beginning and an end."
      },
      {
        "t": "h",
        "text": "A Less Convenient Kind of Beauty"
      },
      {
        "t": "p",
        "text": "Nature is not especially concerned with our schedules. A bloom may open before we arrive, a moth may find it first, and the whole event may be over by morning. That fleeting quality is part of the pleasure."
      },
      {
        "t": "p",
        "text": "If you're used to purchasing perfectly stable botanical imagery, a living plant can be a wonderfully stubborn housemate. It needs the right climate, light, water, and patience. It might even reward you with a scent that no candle quite captures."
      }
    ],
    "tryThis": {
      "title": "An Evening Scent Diary",
      "paras": [
        "Visit a garden or your own outdoor space twice: once in the late afternoon and again after dusk, in a safe, accessible area. Notice which flowers have an obvious scent at each time. Avoid sniffing unidentified plants closely and don't disturb nocturnal wildlife."
      ]
    },
    "takeHome": {
      "name": "A nursery-grown evening-fragrant flowering plant suited to your local climate",
      "paras": [
        "Ask the nursery about its exact species, growing conditions, and pet safety. This is a purchase that gives you an experience rather than an instant result—and that is precisely the point."
      ]
    },
    "object": {
      "name": "A nursery-grown evening-fragrant flowering plant suited to your local climate"
    },
    "references": [
      {
        "before": "",
        "label": "USDA Forest Service, “Pollinators” educational resources",
        "href": "https://www.fs.usda.gov/wildflowers/pollinators/",
        "after": ""
      },
      {
        "before": "",
        "label": "U.S. Botanic Garden, plant education and horticulture resources",
        "href": "https://www.usbg.gov/",
        "after": ""
      }
    ]
  },
  {
    "slug": "smell-of-cities",
    "topic": "Places",
    "families": [
      "fresh",
      "gourmand"
    ],
    "fallback": "families",
    "date": "2026-10-28",
    "views": 2950,
    "image": {
      "src": "https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?auto=format&fit=crop&w=1600&q=80",
      "alt": "A yellow cab on a New York street",
      "credit": "Photo by Robert Bye on Unsplash",
      "creditHref": "https://unsplash.com/photos/yellow-car-running-on-the-street-between-the-building-during-daytime-WTPp4wgourk"
    },
    "objectImage": null,
    "kicker": "Cities / Observation",
    "readTime": "3 min read",
    "title": "Every City Has a Smell. Can You Recognize Yours?",
    "dek": "A field guide to the invisible landmarks we pass every day.",
    "blocks": [
      {
        "t": "p",
        "text": "Ask someone what New York looks like, and you'll get skyscrapers, yellow cabs, and subway entrances. Ask what it smells like, and the answer gets much more interesting—and probably much less suitable for a postcard."
      },
      {
        "t": "p",
        "text": "Hot pretzels. Rain on pavement. Exhaust. A bakery door opening. Summer garbage. A flowering street tree that makes an entire block feel unexpectedly gentle."
      },
      {
        "t": "p",
        "text": "A city's smell isn't a single fragrance. It's an arrangement of activities, materials, weather, and memory that changes by the hour."
      },
      {
        "t": "h",
        "text": "Mapping What Maps Leave Out"
      },
      {
        "t": "p",
        "text": "Artist and researcher Kate McLean has spent years exploring urban smellscapes, collaborating with participants to record smells encountered on walks and translating those observations into maps. Her projects challenge the assumption that a useful map must describe what we see."
      },
      {
        "t": "p",
        "text": "A conventional map can tell you where a bakery is. A smell map might tell you how far its aroma travels on a cold morning or how quickly it disappears when a truck passes. The information is difficult to standardize, but that is part of its value."
      },
      {
        "t": "p",
        "text": "McLean's Amsterdam smell-mapping work, for example, challenged familiar stereotypes about the city. The smells people noticed included waffles, food, laundry, and ordinary domestic life. These less marketable details often say more about the city people inhabit than its official tourist identity."
      },
      {
        "t": "h",
        "text": "The City Is a Temporary Composition"
      },
      {
        "t": "p",
        "text": "A fragrance bottle aims for consistency. A city is notoriously uncooperative. A street corner can smell different in January and July; at 7 a.m. and midnight; before and after a storm. Bakery smells depend on an oven being on. Flowering trees have seasons. Construction sites eventually disappear. A favorite restaurant closes, and a piece of your neighborhood's invisible identity goes with it."
      },
      {
        "t": "p",
        "text": "It's tempting to treat bad smells as failures and pleasant ones as assets. Urban scent is more complicated. The smell of a working harbor, a mechanic's garage, or a busy market may be uncomfortable to some people and deeply familiar to others. Fragrance can carry belonging without being objectively pretty."
      },
      {
        "t": "p",
        "text": "This is why an expensive “New York” candle can only ever be an interpretation. Which New York? Whose street? In what weather? For whom?"
      },
      {
        "t": "h",
        "text": "How to Make a Better Travel Souvenir"
      },
      {
        "t": "p",
        "text": "Instead of buying the first candle labeled with a destination, try building a personal scent inventory. Remember what was happening when you noticed an odor. The pastry shop might stand for a conversation. Rain on concrete might bring back an unexpected walk. A particular tree could remind you of the first apartment that felt like home."
      },
      {
        "t": "p",
        "text": "These details rarely make their way onto tourist maps. They are often the parts of a place we miss most."
      }
    ],
    "tryThis": {
      "title": "The Five-Stop Smellwalk",
      "paras": [
        "Take a short, safe walk through five familiar stops: a street corner, a planted area, a food shop, a transit stop, and your own front door. Write one smell and one memory for each. Don't touch unknown substances or investigate hazardous or foul-smelling sources up close."
      ]
    },
    "takeHome": {
      "name": "A pocket notebook and five blank scent cards",
      "paras": [
        "The notebook is the product; your neighborhood supplies the fragrance. Create a one-page smell map, then revisit it in another season. You may discover a city that you never knew was there."
      ]
    },
    "object": {
      "name": "A pocket notebook and five blank scent cards"
    },
    "references": [
      {
        "before": "",
        "label": "Kate McLean, Sensory Maps (artist project archive)",
        "href": "https://sensorymaps.com/",
        "after": ""
      },
      {
        "before": "",
        "label": "Kate McLean, “The sweet smell of Amsterdam,” The Guardian (2015)",
        "href": "https://www.theguardian.com/cities/2015/oct/07/smell-amsterdam-cannabis-odour-mappers-kate-mclean",
        "after": ""
      }
    ]
  },
  {
    "slug": "clean-smelling-home",
    "topic": "Design",
    "families": [
      "fresh",
      "citrus"
    ],
    "fallback": "families",
    "date": "2026-10-13",
    "views": 2480,
    "image": {
      "src": "https://images.unsplash.com/photo-1547104442-044448b73426?auto=format&fit=crop&w=1600&q=80",
      "alt": "A bed with white sheets and pillows",
      "credit": "Photo by Sincerely Media on Unsplash",
      "creditHref": "https://unsplash.com/photos/a-close-up-of-a-bed-with-white-sheets-and-pillows-56pMIREBAcg"
    },
    "objectImage": null,
    "kicker": "Home / Design",
    "readTime": "3 min read",
    "title": "The Myth of the Clean-Smelling Home",
    "dek": "Who taught us that a room should smell like lemon, lavender, or laundry?",
    "blocks": [
      {
        "t": "p",
        "text": "A freshly cleaned bathroom has a smell. At least, advertising has spent decades convincing us that it should: sharp lemon, synthetic pine, or the soft floral cloud labeled “fresh linen.” If a room smells of nothing at all, we may suspect that someone forgot to finish the job."
      },
      {
        "t": "p",
        "text": "But cleanliness and fragrance are not the same thing. This is a distinction worth considering before adding another bottle to the cabinet beneath the sink."
      },
      {
        "t": "h",
        "text": "The Scent of Proof"
      },
      {
        "t": "p",
        "text": "Modern cleaning products didn't merely help people wash floors and clothing. Their fragrances also became signals that cleaning had happened. Citrus could suggest brightness, pine could suggest outdoor freshness, and powdery musks could suggest freshly laundered fabric."
      },
      {
        "t": "p",
        "text": "These associations are cultural as much as chemical. A lemon fragrance doesn't automatically tell us that a surface has been effectively cleaned. Nor does a room without perfume prove that nothing has been done."
      },
      {
        "t": "p",
        "text": "The U.S. Environmental Protection Agency has pointed out that fragrances in cleaning products can mask odors and serve as cues that a product has been used. Some products and their emissions can also affect indoor air quality, particularly for sensitive people."
      },
      {
        "t": "p",
        "text": "None of this means that enjoying scented laundry is irrational. Scent is pleasurable, and the ritual of changing sheets can be genuinely comforting. The problem begins when a pleasant association is confused with evidence."
      },
      {
        "t": "h",
        "text": "The Laundry Fantasy"
      },
      {
        "t": "p",
        "text": "Consider the phrase “fresh linen.” Actual cotton and linen fabrics don't produce one universal, recognizable fragrance. Your sheets smell like laundry detergent, drying conditions, storage, skin, and the surrounding room. The version sold in home fragrance is a carefully composed fantasy of fabric that has never been slept in."
      },
      {
        "t": "p",
        "text": "It's a powerful fantasy because it turns an ordinary chore into an emotional promise. The candle doesn't just say “this room smells nice.” It says “your life is orderly, your schedule is under control, and the bed has been made.”"
      },
      {
        "t": "p",
        "text": "The fantasy is also endlessly renewable. A candle burns down. A room spray fades. Another bottle appears on the shopping list. The commercial idea of freshness can be designed to disappear just quickly enough to invite replacement."
      },
      {
        "t": "h",
        "text": "What Does Clean Actually Smell Like?"
      },
      {
        "t": "p",
        "text": "Sometimes the most meaningful scent in a home is the absence of a problem: no lingering food odor, no damp towel, no musty closet. Ventilation, appropriate cleaning, and moisture control do the less glamorous work."
      },
      {
        "t": "p",
        "text": "That gives fragrance a more interesting role. Instead of using it to announce cleanliness, you can reserve it for atmosphere. A little cedar, a botanical candle, or nothing at all—each can be a conscious choice rather than a requirement."
      },
      {
        "t": "p",
        "text": "A beautiful home shouldn't need to smell as though a commercial is being filmed inside it."
      }
    ],
    "tryThis": {
      "title": "The Unscented Room Test",
      "paras": [
        "Clean one small space using appropriate fragrance-free products and ventilate it according to product instructions. Leave out room sprays and candles for a day. Notice what the room actually smells like, then decide whether fragrance would add pleasure or merely cover something that needs attention. Never mix cleaning chemicals."
      ]
    },
    "takeHome": {
      "name": "A fragrance-free laundry detergent or unscented cleaning concentrate",
      "paras": [
        "An intentionally quiet product makes room for every other scent in your home. The absence of perfume can be a design decision, too."
      ]
    },
    "object": {
      "name": "A fragrance-free laundry detergent or unscented cleaning concentrate"
    },
    "references": [
      {
        "before": "",
        "label": "U.S. EPA, “Sources of Indoor Particulate Matter”",
        "href": "https://www.epa.gov/indoor-air-quality-iaq/sources-indoor-particulate-matter-pm",
        "after": ""
      },
      {
        "before": "",
        "label": "U.S. EPA, “Can the use of fragrances indoors cause health impacts?”",
        "href": "https://www.epa.gov/asthma/can-use-fragrances-indoors-cause-health-impacts",
        "after": ""
      },
      {
        "before": "",
        "label": "Industrial Fragrance Chemistry: A Brief Historical Perspective",
        "href": "https://www.sciencedirect.com/org/science/article/pii/S1434193X23012112",
        "after": ""
      }
    ]
  },
  {
    "slug": "roses-romance",
    "topic": "History",
    "families": [
      "floral",
      "spicy"
    ],
    "fallback": "families",
    "date": "2026-09-12",
    "views": 1990,
    "image": {
      "src": "https://images.unsplash.com/photo-1572450775448-4af18fd45a0d?auto=format&fit=crop&w=1600&q=80",
      "alt": "A red rose in a vase",
      "credit": "Photo by Zoltan Tasi on Unsplash",
      "creditHref": "https://unsplash.com/photos/red-rose-flower-in-vase-NzDZtmYWdEk"
    },
    "objectImage": null,
    "kicker": "Love / Cultural History",
    "readTime": "3 min read",
    "title": "Who Made Roses Romantic?",
    "dek": "A love story involving mythology, trade, perfume, and a remarkably durable symbol.",
    "blocks": [
      {
        "t": "p",
        "text": "If a stranger hands you a dozen red roses on Valentine's Day, you probably won't assume they want to discuss horticulture. Somehow, the flower has become a message so standardized that it barely requires words."
      },
      {
        "t": "p",
        "text": "But roses are plants, not declarations of love. Who turned them into romance—and why has the symbolism survived so many changes in fashion?"
      },
      {
        "t": "h",
        "text": "Before the Florist"
      },
      {
        "t": "p",
        "text": "In ancient Greek and Roman cultures, roses were associated with deities including Aphrodite and Venus, linking the flower to beauty, love, and desire. They also had other meanings. Roman roses could appear in funerary practices and celebrations of the dead. The same flower wasn't limited to one emotional register."
      },
      {
        "t": "p",
        "text": "Across later centuries, roses moved through gardens, poetry, courtly traditions, and decorative art. Their symbolism changed with the people using them. A flower could suggest love, secrecy, grief, pleasure, or an ideal of beauty that was difficult to possess."
      },
      {
        "t": "p",
        "text": "One historical detail is especially charming: scented letters. The Odeuropa Encyclopedia of Smell History and Heritage describes how rose oil became popular in romantic correspondence in the eighteenth century. Fragrance wasn't only something lovers wore. It was something a message could carry."
      },
      {
        "t": "h",
        "text": "Why Red Wins"
      },
      {
        "t": "p",
        "text": "A red rose makes an extraordinarily efficient symbol. Its color is vivid, its petals are soft, its thorns hint at risk, and the flower is visually recognizable even in a hurried illustration. Those qualities lend themselves to art, advertising, greeting cards, and the annual ritual of Valentine's Day."
      },
      {
        "t": "p",
        "text": "Commercial floristry helped make that visual shorthand repeatable. Once a symbol becomes familiar, repetition strengthens it. People give roses because roses mean romance; roses mean romance partly because people keep giving them."
      },
      {
        "t": "p",
        "text": "Yet the smell is often less predictable than the image. Some modern cut roses have subtle fragrance, while certain garden varieties are intensely scented. A red rose purchased for its appearance might disappoint someone who expects the rich, spicy, honeyed perfume described in poetry."
      },
      {
        "t": "p",
        "text": "That difference reveals something important. We often buy the *idea* of the rose first and encounter the actual flower second."
      },
      {
        "t": "h",
        "text": "A Flower with More Than One Personality"
      },
      {
        "t": "p",
        "text": "Rose perfumery offers a much wider spectrum than greeting cards suggest. A rose accord can be fresh and dewy, dark and wine-like, green, peppery, powdery, or mixed with woods. What people call “rose” is often a highly deliberate arrangement of aromatic materials."
      },
      {
        "t": "p",
        "text": "Try smelling a rose beside its leaves and stem. Notice that the plant is more complicated than the blossom alone. Love may be the familiar interpretation, but it isn't the only story the flower tells."
      },
      {
        "t": "p",
        "text": "There is something liberating about that. A person can love roses without wanting them to represent romance. They can be a botanical obsession, a memory of a grandparent's yard, or simply an excellent flower."
      }
    ],
    "tryThis": {
      "title": "Rose Without the Red",
      "paras": [
        "Visit a florist or garden and compare two different varieties of rose, where permitted. Look first, then smell. Make separate notes for color and scent. Which one would you choose if you were buying for your nose rather than for the photograph?"
      ]
    },
    "takeHome": {
      "name": "One fragrant rose stem in a simple bud vase",
      "paras": [
        "Skip the elaborate arrangement and spend time with a single flower. If you're curious about perfume, compare it later with a rose fragrance sample; the differences are part of the pleasure."
      ]
    },
    "object": {
      "name": "One fragrant rose stem in a simple bud vase"
    },
    "references": [
      {
        "before": "",
        "label": "English Heritage, “Roses through Time”",
        "href": "https://www.english-heritage.org.uk/visit/inspire-me/roses-through-time-a-history-of-rose-gardens-and-roses-as-a-symbol-in-english-culture/",
        "after": ""
      },
      {
        "before": "",
        "label": "Odeuropa Encyclopedia, “Love”",
        "href": "https://encyclopedia.odeuropa.eu/items/show/31",
        "after": ""
      }
    ]
  },
  {
    "slug": "incense-timekeeping",
    "topic": "Rituals",
    "families": [
      "spicy",
      "woody"
    ],
    "fallback": "families",
    "date": "2026-11-04",
    "views": 1760,
    "image": {
      "src": "https://images.unsplash.com/photo-1551690935-a9e6f0a7e788?auto=format&fit=crop&w=1600&q=80",
      "alt": "A lighted incense stick",
      "credit": "Photo by Denis Oliveira on Unsplash",
      "creditHref": "https://unsplash.com/photos/lighted-incense-_12PwFpWZZ0"
    },
    "objectImage": null,
    "kicker": "Philosophy / Ritual",
    "readTime": "3 min read",
    "title": "Is Burning Incense a Form of Keeping Time?",
    "dek": "Before the smartphone timer, there was a clock made of smoke.",
    "blocks": [
      {
        "t": "p",
        "text": "Most clocks tell you how much time has passed without making you feel it. A glowing number changes. A meeting starts. A notification arrives. Another afternoon quietly disappears."
      },
      {
        "t": "p",
        "text": "An incense stick offers a different arrangement. It burns in front of you, changes the air, and becomes shorter. Time isn't a number on a screen. It's something you can smell fading."
      },
      {
        "t": "h",
        "text": "The Clock That Burned"
      },
      {
        "t": "p",
        "text": "Incense has a history as a timekeeping material in parts of Asia. The Seiko Museum explains that combustion clocks used materials such as candles, oil, or incense whose burning could be observed or divided into intervals. In Japan, forms of incense timekeeping were known in connection with religious practice, and more elaborate systems developed across China and elsewhere."
      },
      {
        "t": "p",
        "text": "Some incense clocks used patterned trails of powdered incense. Others used coils or measured sticks. Rather than watching hands circle a face, people could follow a burning line or judge how far the ember had traveled."
      },
      {
        "t": "p",
        "text": "In certain historical designs, the clock could even produce an audible signal when burning incense released a mechanism. A flame could mark an appointment."
      },
      {
        "t": "p",
        "text": "None of this means incense burned with modern atomic precision. Conditions and materials matter. But it suggests a wonderful alternative way of organizing an hour: a timekeeper that participates in the atmosphere of the room."
      },
      {
        "t": "h",
        "text": "The Scent of an Interval"
      },
      {
        "t": "p",
        "text": "Today incense is commonly marketed through the language of mood—calm, focus, grounding, spiritual balance. Those words can be appealing, yet they're broad enough to mean almost anything."
      },
      {
        "t": "p",
        "text": "The timekeeping history offers a more specific possibility. You don't need incense to change your personality. You can use a short burn as the frame for an activity: reading a chapter, sketching, folding laundry, or simply sitting by a window."
      },
      {
        "t": "p",
        "text": "The smoke makes the interval noticeable. You can see the beginning, experience the middle, and recognize the end. That simple structure is increasingly rare in a day filled with activities that don't seem to finish."
      },
      {
        "t": "p",
        "text": "There's also a material lesson. Incense disappears as it works. Unlike a decorative object that asks to be admired indefinitely, it delivers its experience by consuming itself. A little ash remains. Whatever mattered during those minutes must be kept somewhere else."
      },
      {
        "t": "h",
        "text": "A Small Rebellion Against the Clock"
      },
      {
        "t": "p",
        "text": "A digital timer is extremely useful. It can wake you, remind you, and help you catch a train. But it doesn't ask what the hour felt like. Incense might."
      },
      {
        "t": "p",
        "text": "Of course, fragrance isn't appropriate for every household or every space. Smoke can irritate the lungs and affect indoor air quality. If you're sensitive to smoke, use an unlit incense stick as a material study, or choose a scent-free timed ritual instead."
      },
      {
        "t": "p",
        "text": "The essential idea isn't combustion. It's giving time a shape you can recognize."
      }
    ],
    "tryThis": {
      "title": "One Interval, One Activity",
      "paras": [
        "Choose a ten-minute activity. Set an ordinary timer and, if your space is suitable, burn a short incense stick in a stable, fire-safe holder with ventilation. Never leave it unattended. At the end, write down what you noticed about those minutes. Compare that with an ordinary phone-timed break."
      ]
    },
    "takeHome": {
      "name": "A ceramic incense holder and a small box of short-burning incense",
      "paras": [
        "The holder isn't merely a display object; it's a reminder to make a beginning and an ending. For smoke-sensitive homes, substitute a small hourglass."
      ]
    },
    "object": {
      "name": "A ceramic incense holder and a small box of short-burning incense"
    },
    "references": [
      {
        "before": "",
        "label": "Seiko Museum Ginza, “The Origin of the Combustion Clock”",
        "href": "https://museum.seiko.co.jp/en/knowledge/ElementalTimepieces03/",
        "after": ""
      },
      {
        "before": "",
        "label": "HISTORY, “How People Kept Time Before Clocks”",
        "href": "https://www.history.com/articles/ancient-timekeeping",
        "after": ""
      },
      {
        "before": "",
        "label": "U.S. EPA, “Sources of Indoor Particulate Matter”",
        "href": "https://www.epa.gov/indoor-air-quality-iaq/sources-indoor-particulate-matter-pm",
        "after": ""
      }
    ]
  },
  {
    "slug": "fashion-house-candles",
    "topic": "Design",
    "families": [
      "green",
      "woody"
    ],
    "fallback": "families",
    "date": "2026-10-09",
    "views": 3060,
    "image": {
      "src": "https://images.unsplash.com/photo-1707839568938-f9b50bb88454?auto=format&fit=crop&w=1600&q=80",
      "alt": "Two white candles on a table",
      "credit": "Photo by New Flame on Unsplash",
      "creditHref": "https://unsplash.com/photos/a-couple-of-white-candles-sitting-on-top-of-a-table-cm-jg3l6u78"
    },
    "objectImage": null,
    "kicker": "Business / Culture",
    "readTime": "4 min read",
    "title": "Why Fashion Houses Want to Sell You a Candle",
    "dek": "An expensive little object can carry a much bigger fantasy.",
    "blocks": [
      {
        "t": "p",
        "text": "The handbag is out of reach. The runway coat costs more than a month's rent. The beautiful leather chair in a designer boutique is presumably not for sale. But the candle on the website? That feels possible."
      },
      {
        "t": "p",
        "text": "Luxury brands have become remarkably good at selling atmosphere. A home fragrance can place the identity of a fashion house in a living room, no fitting room required."
      },
      {
        "t": "h",
        "text": "The Smallest Room in the Brand Universe"
      },
      {
        "t": "p",
        "text": "A fashion label isn't merely selling fabric or leather. It's selling a recognizable world: a point of view about color, materials, architecture, and the kind of person who might live among them. A candle gives that world another surface on which to appear."
      },
      {
        "t": "p",
        "text": "LOEWE's home-scent collection is a striking example. Its botanical fragrances are presented in sculptural vessels that look like design objects even when unlit. The emphasis isn't only on perfume; it's also on materials, shape, color, and display."
      },
      {
        "t": "p",
        "text": "The commercial logic is straightforward. A candle generally costs far less than a flagship handbag or piece of ready-to-wear. It introduces customers to the brand's aesthetic at another price point. It also travels easily into gift-giving, where buyers may be shopping for someone else's taste rather than their own wardrobe."
      },
      {
        "t": "p",
        "text": "None of this automatically makes a candle inexpensive. Luxury fragrance pricing can still be astonishing. But relative to an entire fashion collection, the object can feel accessible."
      },
      {
        "t": "h",
        "text": "When a Candle Becomes Furniture"
      },
      {
        "t": "p",
        "text": "Think about what happens after the fragrance is gone. Some customers keep the vessel as a pencil cup, vase, or decorative object. The branded container survives the product it held. That is unusually valuable from a design perspective: a purchase that continues to occupy space in daily life."
      },
      {
        "t": "p",
        "text": "The candle also gives a fashion brand unusual control over mood. Clothes move with the wearer and meet the world. A home scent changes the room around its owner. The brand can move from the public performance of style to the private atmosphere of domestic life."
      },
      {
        "t": "p",
        "text": "That shift can feel intimate. A fragrance creates associations with evenings, guests, reading, or the end of a workday. Over time, a brand's scent may become attached to memories that have nothing to do with shopping."
      },
      {
        "t": "h",
        "text": "The Question Behind the Price"
      },
      {
        "t": "p",
        "text": "Is the candle worth it? There's no universal answer. Materials, craftsmanship, vessel design, scent development, and marketing all contribute to a product's identity. But a luxury price isn't a scientific measurement of how good something smells."
      },
      {
        "t": "p",
        "text": "The useful question may be whether you like the fragrance and the object independently of the logo. If the same candle had no label, would you still want it on your table? Would you still want to smell it every evening?"
      },
      {
        "t": "p",
        "text": "That's a far more interesting test than whether the packaging looks good in a shelf photograph."
      }
    ],
    "tryThis": {
      "title": "The Blind Shelf Test",
      "paras": [
        "Visit a fragrance or home store and compare two candles without looking at their labels or prices first, if samples are available. Evaluate the aroma, vessel, and whether you'd enjoy it in your actual home. Then look at the brands. Did the labels change your opinion?"
      ]
    },
    "takeHome": {
      "name": "A single botanical candle in a reusable vessel",
      "paras": [
        "LOEWE's Tomato Leaves line offers a useful case study, but the lesson extends beyond the brand: buy a scent you want to live with, not only a logo you want to display. A small, well-chosen candle is more convincing than a shelf full of aspirations."
      ]
    },
    "object": {
      "name": "A single botanical candle in a reusable vessel"
    },
    "references": [
      {
        "before": "",
        "label": "LOEWE Perfumes, home scent collections",
        "href": "https://www.perfumesloewe.com/",
        "after": ""
      },
      {
        "before": "",
        "label": "LOEWE, Tomato Leaves home scents",
        "href": "https://www.loewe.com/usa/en/women/home/home-scents/tomato-leaves",
        "after": ""
      }
    ]
  },
  {
    "slug": "sea-salt-smell",
    "topic": "Science",
    "families": [
      "fresh",
      "citrus"
    ],
    "fallback": "families",
    "date": "2026-09-26",
    "views": 2210,
    "image": {
      "src": "https://images.unsplash.com/photo-1544047161-b06a6b279e3d?auto=format&fit=crop&w=1600&q=80",
      "alt": "Sea waves at the shore",
      "credit": "Photo by Juan Encalada on Unsplash",
      "creditHref": "https://unsplash.com/photos/seawaves-at-the-shore-Lhu_pjDRN9M"
    },
    "objectImage": null,
    "kicker": "Fragrance / Mythbusting",
    "readTime": "3 min read",
    "title": "What Does Sea Salt Actually Smell Like?",
    "dek": "The ocean in a perfume bottle is mostly an act of imagination.",
    "blocks": [
      {
        "t": "p",
        "text": "Pick up almost any candle labeled “sea salt” and you'll be promised a scene: wind through an open window, a quiet beach, pale linen, maybe a tasteful house nobody has to clean. The scent will probably be fresh, mineral, and a little airy."
      },
      {
        "t": "p",
        "text": "Then go to the kitchen. Open a jar of ordinary table salt. Smell it."
      },
      {
        "t": "p",
        "text": "Not much happens."
      },
      {
        "t": "h",
        "text": "The Ocean Isn't in the Salt"
      },
      {
        "t": "p",
        "text": "Pure sodium chloride doesn't evaporate into the air the way a fragrant essential oil does, so it doesn't provide the distinctive airborne odor of a beach. The sea, meanwhile, is full of living organisms and chemical processes. Some of the recognizable coastal atmosphere arises from compounds associated with marine life, including volatile sulfur compounds produced through biological activity."
      },
      {
        "t": "p",
        "text": "What we casually call “the smell of the ocean” is therefore not one molecule and certainly not just salt. It can include seaweed, damp sand, decaying organic matter, plants, nearby buildings, and weather."
      },
      {
        "t": "p",
        "text": "Perfumery solves this problem through accords: constructed combinations of aromatic ingredients designed to create an impression. A marine or aquatic accord may suggest watery freshness or salty air without literally containing meaningful amounts of ocean water."
      },
      {
        "t": "h",
        "text": "The Accidental Geography of a Fragrance Note"
      },
      {
        "t": "p",
        "text": "“Sea salt” can mean several different things on a product label. In one fragrance it might be soft and clean, almost like freshly washed skin. In another it might be sharp, mineral, and windblown. Elsewhere it may be paired with sage, driftwood, or citrus to give a landscape its supporting characters."
      },
      {
        "t": "p",
        "text": "These descriptive notes are useful storytelling devices, not necessarily ingredient lists. The same distinction applies to “sunshine,” “cashmere,” “rain,” and “swimsuit fabric.” They're invitations to imagine a sensory experience."
      },
      {
        "t": "p",
        "text": "This is part of what makes perfume creative. A musician can compose a sound that suggests a thunderstorm without recording actual thunder. A perfumer can create the feeling of a coast without bringing home a bottle of seawater."
      },
      {
        "t": "h",
        "text": "Which Beach Are We Talking About?"
      },
      {
        "t": "p",
        "text": "The phrase “ocean breeze” tends to flatten all coasts into one beautiful advertisement. But a rocky northern beach is not a humid Gulf Coast afternoon. A beach near a fishing harbor is not a beach beside a pine forest. Even the same shoreline can smell very different as tides, weather, and biological activity change."
      },
      {
        "t": "p",
        "text": "The most interesting coastal fragrance might be the least generically fresh. Perhaps it contains something earthy, vegetal, or faintly strange. Those details make a place believable."
      },
      {
        "t": "p",
        "text": "Rather than asking whether a candle smells exactly like the ocean, ask which memory it's trying to unlock. Is it the towel after swimming, the wind at sunset, or the walk from a rental house to the shore?"
      },
      {
        "t": "p",
        "text": "The answer probably has very little to do with salt itself."
      }
    ],
    "tryThis": {
      "title": "Salt, Citrus, and Seaweed",
      "paras": [
        "Smell three separate everyday materials: a jar of clean sea salt, a piece of citrus peel, and a package of food-grade dried seaweed. Compare them with a sea-salt fragrance sample, if available. Which material actually gives you the strongest impression of the coast?"
      ]
    },
    "takeHome": {
      "name": "A small marine-fragrance sample plus a jar of culinary sea salt",
      "paras": [
        "One is a constructed sensory landscape; the other is a material. Put them side by side and discover how much of “sea salt” fragrance comes from imagination rather than salt."
      ]
    },
    "object": {
      "name": "A small marine-fragrance sample plus a jar of culinary sea salt"
    },
    "references": [
      {
        "before": "",
        "label": "NOAA Ocean Service, ocean science education",
        "href": "https://oceanservice.noaa.gov/",
        "after": ""
      },
      {
        "before": "",
        "label": "The Perfume Society, perfume ingredient and accord encyclopedia",
        "href": "https://perfumesociety.org/ingredients/",
        "after": ""
      }
    ]
  }
];

export const articleBySlug = (slug: string): Article | undefined => ARTICLES.find((a) => a.slug === slug);

/** Newest first. */
export const byDate = (list: Article[] = ARTICLES): Article[] => [...list].sort((a, b) => b.date.localeCompare(a.date));
/** Most read first. */
export const byViews = (list: Article[] = ARTICLES): Article[] => [...list].sort((a, b) => b.views - a.views);

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Nov 10, 2026" */
export function articleDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${SHORT[m - 1]} ${d}, ${y}`;
}
/** "November 2026" */
export function articleMonth(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}
/** 5820 -> "5.8k reads" */
export function reads(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k reads` : `${n} reads`;
}

