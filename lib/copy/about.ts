/* Generated from docs/copy/olfia-site-copy-v1.md (Tiffany's copy v1, 11/24) by gen_copy.py. Edit the document, not this file. */
import type { ResearchId } from "@/lib/copy/research";

export interface ConceptPart { theme: string; title: string; paragraphs: readonly string[]; sources: readonly ResearchId[]; note: string }
/** §1.6 The Concept: four editorial sections. */
export const CONCEPT: readonly ConceptPart[] = [
  {
    "theme": "Scent & Memory",
    "title": "Scent is an afterimage.",
    "paragraphs": [
      "Think of a smell you recognize before you remember where you know it from. It might be the soap in a childhood bathroom, the paper in a bookstore, or the particular combination of cooking and laundry that made a place feel like home. Sometimes a familiar scent brings an entire scene to mind, including details that were never especially important at the time.",
      "Research on autobiographical memory has explored how odors can serve as cues to personal experiences, often with a striking emotional quality. The associations are individual: the same fragrance can recall very different things for different people. This is what the afterimage means to Olfia. An experience may be over, but an impression of it remains.",
      "Capture and Scent Atlas give that impression a place to live in words and images. A short note about where you were and how a scent felt can be enough to return to it later."
    ],
    "sources": [
      "R11",
      "R12"
    ],
    "note": "Afterimage is a brand metaphor, not a scientific equivalence."
  },
  {
    "theme": "Scent & Space",
    "title": "Olfactory, and utopia.",
    "paragraphs": [
      "The name Olfia brings together olfactory, our sense of smell, and utopia, a word that plays on the idea of a good place and a place that does not exist. It holds two kinds of rooms in mind: the ones we live in, and the ones we are still imagining.",
      "Interior design tends to begin with the things we can see: furniture, color, texture, light. Yet a place also has an atmosphere shaped by what happens in it, from cooking to an open window and the scents we bring indoors. Researchers use the term smellscape to describe the olfactory character of an environment as it is experienced in context.",
      "Rooms is a playful way to consider this often overlooked dimension of a space. Try arranging familiar objects alongside fragrance families and different times of day. The design is an invitation to imagine an atmosphere and then explore what might work in your own home."
    ],
    "sources": [
      "R13",
      "R14"
    ],
    "note": "Rooms is conceptual design, not physical scent simulation."
  },
  {
    "theme": "Scent & Everyday Life",
    "title": "The art of everyday living.",
    "paragraphs": [
      "A pot of coffee before work, sheets drying by the window, a handful of herbs on the kitchen counter. Many of the things that make a day feel distinctly ours happen without much ceremony. Fragrance is already woven into these activities, whether or not we think of ourselves as people who collect perfumes or buy scented candles.",
      "The idea of everyday aesthetics encourages us to pay attention to how ordinary objects, actions, and surroundings shape our experience. A home can be carefully arranged one day and full of the traces of cooking, work, or visitors the next. Both are part of its character.",
      "Olfia invites you to notice these changes and experiment with them. Keep a scent you enjoy, make a note about one you would rather avoid, or imagine something different for tomorrow. Your own experiences are the starting point."
    ],
    "sources": [
      "R15",
      "R16"
    ],
    "note": ""
  },
  {
    "theme": "Scent & Culture",
    "title": "The worlds we know by scent.",
    "paragraphs": [
      "The smell of a home tells us something about its inhabitants. It might come from what they cook, the plants they keep, the products they use to wash their clothes, or the materials they use during a celebration. These associations are learned through particular places, families, and communities. What feels familiar to one person may be entirely new to another.",
      "Scent also carries histories that are easy to overlook. Heritage researchers have investigated the smell of historic libraries, documenting the ways people describe old books alongside analysis of the materials themselves. Other work explores how walking through a place with attention to smell can reveal aspects of its cultural history.",
      "Scentpedia and The Olfia Edit grow out of this curiosity. By exploring the plants, ingredients, and traditions behind fragrance, we can better appreciate where our everyday scents come from and the many meanings people give them."
    ],
    "sources": [
      "R13",
      "R17",
      "R18"
    ],
    "note": ""
  }
];

/** §1.6 How it Works: five independent entry points (no loop, no order), then the two notes. */
export const HOW_IT_WORKS = {
  "title": "Make yourself at home.",
  "lead": "Start with something you’re curious about, a scent you want to remember, or a room you’ve been imagining.",
  "entries": [
    {
      "feature": "Discover",
      "title": "Curious about a scent?",
      "body": "Get to know fragrance families, discover unfamiliar ingredients, and explore the stories behind the things we smell.",
      "cta": "Explore Scentpedia"
    },
    {
      "feature": "Rooms",
      "title": "Imagine a place of your own.",
      "body": "Arrange furniture and materials, choose fragrance families, and explore how time of day and an open window might change the atmosphere you imagine.",
      "cta": "Design your space"
    },
    {
      "feature": "Capture",
      "title": "Remember how it smelled.",
      "body": "Keep a record of a scent you encountered, where you were, what you were doing, and how it made you feel.",
      "cta": "Capture a scent"
    },
    {
      "feature": "Share",
      "title": "Send a piece of your world.",
      "body": "Turn a saved scent or room into a personal visual card to keep or share with someone.",
      "cta": "Make a Scent Card"
    },
    {
      "feature": "Scent Atlas",
      "title": "Watch your collection grow.",
      "body": "Revisit your room designs, scent notes, and fragrance shelf. See what you have collected as your interests and routines change.",
      "cta": "Open your Scent Atlas"
    }
  ],
  "families": {
    "title": "Where the seven families come from",
    "body": "Olfia adapts Michael Edwards’ Fragrance Wheel, which organizes perfume into related scent families, for the world of home fragrance. We group floral, amber and woody profiles alongside green and herbal, citrus and fruit, and fresh and clean scents; gourmand has its own category for edible associations. The categories overlap, so use them as a vocabulary for exploration. You can see the connections to Edwards’ wheel in Scentpedia.",
    "sources": [
      "R1",
      "R2",
      "R19"
    ]
  },
  "ideas": [
    {
      "name": "The Olfia Edit",
      "line": "Culture, fragrance, and the art of living."
    },
    {
      "name": "Olfia · Gifts",
      "line": "Find a fragrance for yourself or someone you have in mind."
    }
  ],
  "ideasTitle": "Where new ideas come from"
} as const;
/** §1.6 The Creator: her letter, four paragraphs. [VERIFY] she approves the first-person wording before it is published. */
export const CREATOR_LETTER = [
  "I’m a graduate student at USC Annenberg, and Olfia is my capstone project. It began with two habits of mine: paying attention to fragrance and the way it shapes my everyday experience, and finding ways to document and reflect on the small rituals that make up my days. I wanted to bring those two things together in a space that would make exploring fragrance feel both personal and approachable.",
  "Having lived in China and the United States, I have also become interested in the different ways people scent their homes, mark the seasons, and use fragrant materials in celebrations and ceremonies. I find it fascinating that a smell can feel so familiar to one person and hold an entirely different association for someone else. Our experiences of fragrance are shaped by the places we have lived and by the people and cultures we encounter.",
  "My interests in aesthetics, modern art, and cultural anthropology have led me to think about fragrance as part of a larger sensory experience. I am equally curious about botany, the environment, and the knowledge that different communities, including Indigenous communities, have developed about plants. These interests often meet in the seemingly ordinary materials used to scent a room. There is so much to learn about where they come from, how they are used, and the stories they carry.",
  "Olfia is my way of making room for that curiosity. I hope it can become a place where people feel comfortable experimenting with the atmosphere of their homes, learning something unexpected about familiar scents, and keeping the experiences they want to remember. It is still a work in progress, and I hope the people who use it will find their own ways of making it meaningful."
] as const;
