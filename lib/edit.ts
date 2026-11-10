import type { FamilyId } from "@/lib/types";

/**
 * The Olfia Edit — articles. Text, images, credits and references are Tiffany's: three from her file
 * "The Edit — Three Articles" (2026-11-09) and four from "THE EDIT — New Editorial Stories"
 * (2026-11-10), converted without rewording. Inline *italics* and **bold** are kept as she wrote
 * them and rendered by components/edit/Rich.tsx.
 * Images are linked from their sources with credit, for the academic prototype (the four new covers
 * are Unsplash photographs from the galleries she linked); each article has a drawn fallback cover in
 * components/edit/ArticleCover.tsx if the source stops serving it.
 * Dates and read counts are sample figures for the prototype (Tiffany 11/10: show the tracking
 * system as it would work); replace them with real numbers once the site has analytics.
 */

export type Topic = "Film" | "Books" | "Places" | "Science" | "Design" | "Food" | "Seasons";

export interface ArticleImage { src: string; alt: string; credit: string; creditHref?: string }
export type Fallback = "pool" | "lobby" | "pomander" | "books" | "rain" | "tomato" | "vanilla";
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
  object: { name: string; notes: string; meta?: string; href?: string; cta?: string };
  objectImage: ArticleImage | null;
  references: Array<{ before: string; label?: string; href?: string; after?: string }>;
}

export const TOPICS: Topic[] = ["Film", "Books", "Places", "Science", "Design", "Food", "Seasons"];

export const ARTICLES: Article[] = [
  {
    "slug": "if-barbie-land-had-a-smell",
    "topic": "Film",
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
    "topic": "Seasons",
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
    "topic": "Books",
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
    "topic": "Food",
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

/** Titles Tiffany has pitched for later issues (her "Twelve More Editorial Pitches"), shown as "Coming up". */
export const PITCHES: Array<{ topic: string; title: string }> = [
  { topic: "Culture / Cinema", title: "Why Every Movie Theater Smells Like Popcorn" },
  { topic: "Rituals / Japan", title: "Why a Japanese Bathroom Smells Different" },
  { topic: "Botany / Nightlife", title: "The Flowers That Wait Until Dark" },
  { topic: "Fragrance / Mythbusting", title: "What Does Sea Salt Actually Smell Like?" },
];
