import type { Course, Section } from "@/lib/catalog/types";
import { COVERS } from "@/lib/catalog/seed/covers";

type LessonSpec = [title: string, minutes: number, preview?: boolean];
type SectionSpec = [title: string, lessons: LessonSpec[]];
type CourseSpec = Omit<Course, "sections" | "language" | "updatedAt"> & {
  sections: SectionSpec[];
  language?: string;
  updatedAt?: string;
};

function buildSections(courseId: string, specs: SectionSpec[]): Section[] {
  let n = 0;
  return specs.map(([title, lessons], s) => ({
    id: `${courseId}-s${s + 1}`,
    title,
    lessons: lessons.map(([lt, minutes, preview]) => ({
      id: `${courseId}-l${++n}`,
      title: lt,
      durationSec: Math.round(minutes * 60),
      preview: Boolean(preview),
    })),
  }));
}

function course(spec: CourseSpec): Course {
  return {
    ...spec,
    language: spec.language ?? "English",
    updatedAt: spec.updatedAt ?? "2026-10-01T00:00:00.000Z",
    cover: spec.cover ?? COVERS[spec.id],
    sections: buildSections(spec.id, spec.sections),
  };
}

export const COURSES: Course[] = [
  // ---------------- Fashion ----------------
  course({
    id: "c-ankara-dress", slug: "sew-your-first-ankara-dress", teacherId: "t-adaeze", category: "fashion", level: "beginner",
    title: "Sew Your First Ankara Dress", subtitle: "From measuring tape to a dress you can wear out",
    description: "Never touched a sewing machine? Start here. You will take your own measurements, draft a simple bodice and flare skirt, cut Ankara without wasting fabric and sew a fully lined dress.\n\nEvery step is filmed close up from above, so you can follow along on your phone, one lesson at a time.",
    outcomes: ["Take accurate body measurements", "Draft a basic bodice and skirt pattern", "Cut fabric with zero waste", "Sew darts, an invisible zip and a clean hem"],
    requirements: ["Any sewing machine (manual is fine)", "3 to 4 yards of Ankara fabric", "Measuring tape, chalk and scissors"],
    price: 15000, currency: "NGN", rating: 4.9, ratingCount: 312, students: 1240, badge: "bestseller",
    sections: [
      ["Getting ready", [["Welcome: what you will make", 4, true], ["Tools you need (and what to skip)", 7], ["Threading and testing your machine", 11]]],
      ["Pattern and cutting", [["Taking measurements properly", 14, true], ["Drafting the bodice", 18], ["Drafting the flare skirt", 13], ["Laying out and cutting Ankara", 12]]],
      ["Sewing the dress", [["Darts and shoulder seams", 15], ["Inserting an invisible zip", 17], ["Attaching the skirt", 12], ["Hemming and finishing", 10]]],
    ],
  }),
  course({
    id: "c-tailoring-business", slug: "start-a-tailoring-business-from-home", teacherId: "t-kwame", category: "fashion", level: "intermediate",
    title: "Start a Tailoring Business From Home", subtitle: "Pricing, first customers and growing on Instagram",
    description: "You can sew. Now turn it into a real income. Learn how to price so you make profit, find your first 20 customers through WhatsApp and Instagram, take photos that sell, and handle deposits and deadlines like a pro.",
    outcomes: ["Price your work for profit", "Win customers on WhatsApp and Instagram", "Shoot product photos on a phone", "Manage orders, deposits and delivery dates"],
    requirements: ["You can already sew simple garments", "A smartphone"],
    price: 180, currency: "GHS", rating: 4.8, ratingCount: 198, students: 860, badge: "top-rated",
    sections: [
      ["Money first", [["Why most tailors undercharge", 8, true], ["Costing a garment line by line", 16], ["Setting your price list", 11]]],
      ["Getting customers", [["Your WhatsApp catalogue", 12], ["Instagram that brings orders", 18], ["Photos that sell, with one phone", 14, true]]],
      ["Running the business", [["Deposits, deadlines and difficult clients", 13], ["Growing to your first apprentice", 10]]],
    ],
  }),
  course({
    id: "c-agbada", slug: "agbada-and-kaftan-masterclass", teacherId: "t-kwame", category: "fashion", level: "advanced",
    title: "Agbada & Kaftan Masterclass", subtitle: "Cut, embroider and finish menswear like a master",
    description: "The garments grooms and big men pay the most for. Cut a three-piece agbada, construct a structured kaftan and add neckline embroidery that makes clients come back.",
    outcomes: ["Cut a full three-piece agbada", "Construct a structured kaftan", "Design and stitch neckline embroidery", "Finish to premium standard"],
    requirements: ["Comfortable with intermediate sewing", "Industrial or heavy-duty machine recommended"],
    price: 32000, currency: "NGN", rating: 4.9, ratingCount: 87, students: 410,
    sections: [
      ["The agbada", [["Anatomy of a great agbada", 9, true], ["Cutting the outer robe", 22], ["Assembly and pleating", 19]]],
      ["The kaftan", [["Drafting a fitted kaftan", 17], ["Collars and plackets", 15]]],
      ["Embroidery and finishing", [["Designing the neckline", 12], ["Machine embroidery techniques", 21], ["Pressing and presentation", 9]]],
    ],
  }),

  // ---------------- Hair ----------------
  course({
    id: "c-knotless", slug: "knotless-braids-masterclass", teacherId: "t-wanjiru", category: "hair", level: "intermediate",
    title: "Knotless Braids Masterclass", subtitle: "Clean parts, flat roots and happy clients",
    description: "Knotless braids the way top salons do them. Perfect parting for every size, the feed-in method with no bumps, faster finishing and how to price your service so the hours are worth it.",
    outcomes: ["Clean parting for any size", "Feed-in technique with flat roots", "Speed tips to finish hours faster", "Price braiding services with confidence"],
    requirements: ["Basic braiding experience", "Braiding hair, rat-tail comb and gel"],
    price: 2500, currency: "KES", rating: 4.9, ratingCount: 455, students: 2110, badge: "bestseller",
    sections: [
      ["Foundations", [["What makes knotless different", 6, true], ["Preparing the hair", 12], ["Parting like a pro", 16, true]]],
      ["The technique", [["The feed-in method", 21], ["Keeping roots flat", 14], ["Medium vs small vs jumbo", 18]]],
      ["Finish and business", [["Sealing ends", 9], ["Speed drills", 13], ["Pricing and booking", 11]]],
    ],
  }),
  course({
    id: "c-wig", slug: "wig-making-for-beginners", teacherId: "t-wanjiru", category: "hair", level: "beginner",
    title: "Wig Making for Beginners", subtitle: "Build and customise a closure wig from scratch",
    description: "Make your own closure wig: measure the head, set up the cap, sew wefts flat and customise the hairline so it looks like it grows from the scalp.",
    outcomes: ["Measure and prepare a wig cap", "Sew wefts flat and tight", "Pluck and customise a closure", "Style and maintain your wig"],
    requirements: ["Wig head, curved needle and thread", "Bundles and a closure"],
    price: 3000, currency: "KES", rating: 4.7, ratingCount: 201, students: 940,
    sections: [
      ["Setting up", [["What you need", 5, true], ["Measuring the head", 9], ["Securing the cap", 8]]],
      ["Building the wig", [["Placing the closure", 12], ["Sewing wefts flat", 24], ["Adding the elastic band", 7]]],
      ["Customising", [["Plucking the hairline", 14], ["Bleaching knots", 11], ["First styling", 10]]],
    ],
  }),
  course({
    id: "c-cornrows", slug: "cornrows-and-fulani-styles", teacherId: "t-wanjiru", category: "hair", level: "beginner",
    title: "Cornrows & Fulani Styles", subtitle: "The styles every client asks for",
    description: "Free starter course. Learn neat cornrows, then build up to Fulani braids with beads and side designs.",
    outcomes: ["Neat, even cornrows", "Fulani braid layout", "Adding beads and cuffs"],
    requirements: ["Comb, gel and braiding hair"],
    price: 0, currency: "KES", rating: 4.8, ratingCount: 610, students: 5200, badge: "top-rated",
    sections: [
      ["Cornrows", [["Hand position and tension", 8, true], ["Straight-back cornrows", 15, true]]],
      ["Fulani", [["Layout and parting", 12, true], ["Braiding and beading", 18, true]]],
    ],
  }),

  // ---------------- Beauty ----------------
  course({
    id: "c-bridal", slug: "bridal-makeup-for-melanin-skin", teacherId: "t-amina", category: "beauty", level: "advanced",
    title: "Bridal Makeup for Melanin Skin", subtitle: "Flawless base that lasts 14 hours in the heat",
    description: "Pro bridal makeup for deep skin tones. Colour-match without the grey cast, build a base that survives the heat and dancing, and master three signature bridal looks clients pay top money for.",
    outcomes: ["Colour-match foundation for deep skin", "Build a 14-hour base", "Three signature bridal looks", "Pricing and booking bridal clients"],
    requirements: ["Your own makeup kit", "Some makeup experience"],
    price: 20000, currency: "NGN", rating: 4.9, ratingCount: 142, students: 670, badge: "top-rated",
    sections: [
      ["Skin and base", [["Reading undertones", 10, true], ["Prep that lasts", 12], ["Foundation and concealer", 19]]],
      ["Signature looks", [["Soft glam", 22], ["Classic red lip", 18], ["Glam with gold", 24]]],
      ["Business", [["Bridal trials and packages", 11], ["Working the big day", 9]]],
    ],
  }),
  course({
    id: "c-everyday", slug: "everyday-glow-makeup", teacherId: "t-amina", category: "beauty", level: "beginner",
    title: "Everyday Glow in 15 Minutes", subtitle: "A simple routine you will actually use",
    description: "A fast, fresh everyday look with five products. Perfect for beginners and busy mornings.",
    outcomes: ["A 15-minute routine", "Choosing the right shades", "Glow without oil"],
    requirements: ["Basic makeup products"],
    price: 5000, currency: "NGN", rating: 4.7, ratingCount: 280, students: 1960, badge: "new",
    sections: [
      ["The routine", [["Skin prep", 5, true], ["Base in 3 minutes", 7], ["Brows and lashes", 8], ["Lips and glow", 6]]],
    ],
  }),
  course({
    id: "c-gele", slug: "gele-tying-for-occasions", teacherId: "t-amina", category: "beauty", level: "intermediate",
    title: "Gele Tying for Every Occasion", subtitle: "Fan, pleated and the trending styles",
    description: "Tie stunning gele for weddings and owambe. Learn the fan, the pleated crown and fast styles you can sell as a service.",
    outcomes: ["Fan gele", "Pleated crown gele", "Tying for clients quickly"],
    requirements: ["Aso-oke or damask gele"],
    price: 8000, currency: "NGN", rating: 4.8, ratingCount: 120, students: 730,
    sections: [
      ["Basics", [["Choosing and folding", 7, true], ["Tying on yourself", 12]]],
      ["Styles", [["The fan", 14], ["The pleated crown", 16], ["Speed styles for events", 11]]],
    ],
  }),

  // ---------------- Dance ----------------
  course({
    id: "c-amapiano", slug: "amapiano-dance-from-zero", teacherId: "t-thando", category: "dance", level: "beginner",
    title: "Amapiano Dance From Zero", subtitle: "The moves everyone is doing, broken down",
    description: "Learn the ten core Amapiano moves step by step, count the music and stay on beat, then put it together into a full one-minute routine you can post.",
    outcomes: ["10 core Amapiano moves", "Count music and stay on beat", "A full 1-minute routine"],
    requirements: ["Space to move", "Comfortable shoes"],
    price: 250, currency: "ZAR", rating: 4.9, ratingCount: 980, students: 4150, badge: "bestseller",
    sections: [
      ["Warm up and rhythm", [["Feel the log drum", 6, true], ["Counting the music", 8, true]]],
      ["The moves", [["Pouncing cat and variations", 11], ["Tshwala bam", 9], ["The groove walk", 10], ["Arm styling", 8]]],
      ["Routine", [["Putting it together", 14], ["Filming your routine", 7]]],
    ],
  }),
  course({
    id: "c-afrobeats", slug: "afrobeats-choreography", teacherId: "t-thando", category: "dance", level: "intermediate",
    title: "Afrobeats Choreography", subtitle: "Create and film your own routines",
    description: "Go from following routines to making your own. Build choreography from any Afrobeats song, add your signature style and film it for TikTok and Instagram.",
    outcomes: ["Build a routine from any song", "Find your signature style", "Film dance for social media"],
    requirements: ["You know basic Afrobeats moves"],
    price: 350, currency: "ZAR", rating: 4.8, ratingCount: 377, students: 1880,
    sections: [
      ["Musicality", [["Hearing the layers", 9, true], ["Mapping a song", 12]]],
      ["Creating", [["Building 8-counts", 15], ["Transitions", 13], ["Your signature", 10]]],
      ["Camera", [["Framing and angles", 8], ["Editing on your phone", 11]]],
    ],
  }),
  course({
    id: "c-azonto", slug: "azonto-and-ghana-street-dance", teacherId: "t-kwame", category: "dance", level: "beginner",
    title: "Azonto & Ghana Street Dance", subtitle: "Fun, fast and full of character",
    description: "A free taster of Ghana's street dance styles, from Azonto to Shaku Shaku crossovers.",
    outcomes: ["Azonto basics", "Freestyle with confidence"],
    requirements: ["None"],
    price: 0, currency: "GHS", rating: 4.6, ratingCount: 240, students: 3400, badge: "new",
    sections: [["Moves", [["Azonto basics", 7, true], ["Adding character", 8, true], ["Freestyle drills", 9, true]]]],
  }),

  // ---------------- Music ----------------
  course({
    id: "c-djembe", slug: "djembe-drumming-basics", teacherId: "t-fatou", category: "music", level: "beginner",
    title: "Djembe Drumming Basics", subtitle: "Bass, tone and slap, the West African way",
    description: "Learn the three voices of the djembe and play four traditional rhythms from Senegal and Mali, the way griot families teach them.",
    outcomes: ["Play bass, tone and slap clearly", "Four traditional rhythms", "Keep time with other drummers"],
    requirements: ["A djembe (any size)"],
    price: 6000, currency: "XOF", rating: 4.8, ratingCount: 133, students: 720,
    sections: [
      ["The three voices", [["Sitting and hand position", 6, true], ["Bass", 7], ["Tone and slap", 12]]],
      ["Rhythms", [["Kuku", 11], ["Djole", 10], ["Lamban", 12], ["Soli", 13]]],
    ],
  }),
  course({
    id: "c-talking-drum", slug: "talking-drum-fundamentals", teacherId: "t-fatou", category: "music", level: "intermediate",
    title: "Talking Drum Fundamentals", subtitle: "Make the drum speak",
    description: "Squeeze, strike and phrase. Learn how the talking drum mimics speech and play classic call-and-response patterns.",
    outcomes: ["Pitch control with the squeeze", "Classic phrases", "Call and response"],
    requirements: ["A talking drum and stick"],
    price: 9000, currency: "XOF", rating: 4.9, ratingCount: 64, students: 290, badge: "top-rated",
    sections: [
      ["Control", [["Holding the drum", 6, true], ["The squeeze", 11]]],
      ["Speaking", [["Phrases from speech", 14], ["Call and response", 12]]],
    ],
  }),
  course({
    id: "c-afrobeat-production", slug: "afrobeats-production-on-your-phone", teacherId: "t-thando", category: "music", level: "beginner",
    title: "Make Afrobeats on Your Phone", subtitle: "Drums, bass and log drums with free apps",
    description: "Produce your first Afrobeats and Amapiano beats using only a phone and free apps.",
    outcomes: ["Program Afrobeats drums", "Write a bassline", "Export a finished beat"],
    requirements: ["A smartphone", "Headphones"],
    price: 300, currency: "ZAR", rating: 4.7, ratingCount: 190, students: 1320, badge: "new",
    sections: [
      ["Beats", [["Setting up the app", 6, true], ["The Afrobeats groove", 13], ["Log drums", 12]]],
      ["Finish", [["Bass and chords", 14], ["Mixing basics", 11], ["Exporting", 5]]],
    ],
  }),

  // ---------------- Crafts ----------------
  course({
    id: "c-beadwork", slug: "beadwork-jewellery-basics", teacherId: "t-naledi", category: "crafts", level: "beginner",
    title: "Beadwork Jewellery Basics", subtitle: "Make necklaces and bracelets to sell",
    description: "A free starter course. Learn the tools, three core stitches, and make two pieces you can sell this week.",
    outcomes: ["Choose beads and thread", "Three core stitches", "Finish clasps that last"],
    requirements: ["Seed beads, needle and thread"],
    price: 0, currency: "ZAR", rating: 4.7, ratingCount: 540, students: 3020,
    sections: [["Start beading", [["Tools and beads", 6, true], ["Ladder stitch", 9, true], ["Peyote stitch", 12, true], ["Finishing clasps", 7, true]]]],
  }),
  course({
    id: "c-zulu-beadwork", slug: "zulu-beadwork-colour-stories", teacherId: "t-naledi", category: "crafts", level: "intermediate",
    title: "Zulu Beadwork & Colour Stories", subtitle: "Patterns with meaning, pieces that sell",
    description: "Learn the meaning behind Zulu colour and pattern, and create statement collars and love letters for boutiques.",
    outcomes: ["Read and design colour stories", "Statement collar construction", "Selling to boutiques"],
    requirements: ["Comfortable with basic stitches"],
    price: 450, currency: "ZAR", rating: 4.9, ratingCount: 76, students: 340, badge: "top-rated",
    sections: [
      ["Meaning", [["The language of colour", 10, true], ["Pattern and shape", 9]]],
      ["Making", [["Love letter pendant", 16], ["Statement collar", 24]]],
      ["Selling", [["Pricing and boutiques", 11]]],
    ],
  }),
  course({
    id: "c-pottery", slug: "pottery-with-ghanaian-clay", teacherId: "t-kofi", category: "crafts", level: "beginner",
    title: "Pottery With Ghanaian Clay", subtitle: "Hand-building and firing without a kiln",
    description: "Hand-build bowls and vessels with local clay, decorate with traditional patterns and fire safely without an electric kiln.",
    outcomes: ["Pinch and coil building", "Traditional surface patterns", "Open pit firing safely"],
    requirements: ["Clay", "Outdoor space for firing"],
    price: 250, currency: "GHS", rating: 4.8, ratingCount: 58, students: 260, badge: "new",
    sections: [
      ["Building", [["Preparing clay", 8, true], ["Pinch pots", 12], ["Coil vessels", 18]]],
      ["Finishing", [["Burnishing and patterns", 14], ["Pit firing", 16]]],
    ],
  }),
];
