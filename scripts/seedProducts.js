import dbConnect from "../lib/mongodb";
import Product from "../models/product";

const products = [
  {
    id: "ceramic-vase-blush",
    name: "Artisan Ceramic Vase",
    price: 145,
    category: "Vases",
    images: [
      "/images/ceramic-vase-blush-front.jpg",
      "/images/ceramic-vase-blush-detail.jpg",
    ],
    description: "Handcrafted ceramic vase in soft blush tones",
    longDescription:
      "Each vase is individually hand-thrown by our skilled ceramicists using traditional techniques passed down through generations. The soft blush glaze is achieved through a carefully controlled firing process, resulting in subtle variations that make each piece uniquely beautiful. Perfect as a standalone sculptural piece or for displaying your favorite botanicals.",
    materials: ["Hand-thrown stoneware ceramic", "Lead-free matte glaze", "Waterproof interior coating"],
    care: ["Wipe clean with soft damp cloth", "Avoid harsh chemicals", "Handle with care"],
    sizes: [
      { size: "Small (6in)", available: true },
      { size: "Medium (9in)", available: true },
      { size: "Large (12in)", available: true },
    ],
    colors: [
      { name: "Blush", hex: "#D4A5A5", available: true },
      { name: "Sage", hex: "#A5C4A5", available: true },
      { name: "Cream", hex: "#F5EDE8", available: true },
    ],
    details: [
      "Handcrafted by skilled artisans",
      "Unique variations in each piece",
      "Food-safe glaze",
      "Signed by the maker",
    ],
    madeIn: "Portland, Oregon",
    dimensions: "6-12 inches tall",
    weight: "1.2 - 2.8 lbs",
  },
  {
    id: "linen-throw-sage",
    name: "Belgian Linen Throw",
    price: 195,
    category: "Textiles",
    images: [
      "/images/linen-throw-sage-front.jpg",
      "/images/linen-throw-sage-detail.jpg",
    ],
    description: "Luxuriously soft linen throw in calming sage",
    longDescription:
      "Woven from premium Belgian flax linen, this throw blanket brings both comfort and elegance to any space. The natural temperature-regulating properties of linen make it perfect year-round. Pre-washed for exceptional softness, it features hand-tied fringe details that add a touch of artisanal charm.",
    materials: ["100% Belgian flax linen", "OEKO-TEX certified", "Hand-tied fringe"],
    care: ["Machine wash cold, gentle cycle", "Tumble dry low", "Iron while slightly damp for crisp finish"],
    sizes: [
      { size: '50" x 60"', available: true },
      { size: '60" x 80"', available: true },
    ],
    colors: [
      { name: "Sage", hex: "#A5C4A5", available: true },
      { name: "Dusty Rose", hex: "#D4A5A5", available: true },
      { name: "Natural", hex: "#E8D5C4", available: true },
      { name: "Slate", hex: "#8B8585", available: false },
    ],
    details: [
      "Stonewashed for softness",
      "Temperature regulating",
      "Gets softer with every wash",
      "Sustainably sourced",
    ],
    madeIn: "Belgium",
    dimensions: '50" x 60" or 60" x 80"',
    weight: "2.5 lbs",
  },
  {
    id: "brass-candle-holder",
    name: "Brass Candle Holder Set",
    price: 125,
    category: "Lighting",
    images: [
      "/images/brass-candle-holder-front.jpg",
      "/images/brass-candle-holder-detail.jpg",
    ],
    description: "Elegant brass candleholders with modern geometry",
    longDescription:
      "This stunning set of three candle holders combines timeless brass craftsmanship with contemporary geometric design. Each piece is hand-finished with a brushed matte surface that develops a beautiful patina over time. The varying heights create visual interest when displayed together, making them perfect for mantels, dining tables, or entryways.",
    materials: ["Solid brass construction", "Brushed matte finish", "Felt-lined base"],
    care: ["Dust with soft cloth", "Polish occasionally with brass cleaner", "Remove candle drips when cool"],
    sizes: [
      { size: "Set of 3", available: true },
      { size: "Single Tall", available: true },
      { size: "Single Medium", available: true },
    ],
    colors: [
      { name: "Brushed Brass", hex: "#D4C4A5", available: true },
      { name: "Antique Bronze", hex: "#8B7355", available: true },
      { name: "Matte Black", hex: "#4A4A4A", available: false },
    ],
    details: [
      "Set includes 3 different heights",
      "Fits standard taper candles",
      "Weighted base for stability",
      "Gift-ready packaging",
    ],
    madeIn: "India",
    dimensions: '4", 6", and 8" heights',
    weight: "1.8 lbs total",
  },
  {
    id: "velvet-cushion-dusty-rose",
    name: "Velvet Accent Cushion",
    price: 85,
    category: "Textiles",
    images: [
      "/images/velvet-cushion-dusty-rose-front.jpg",
      "/images/velvet-cushion-dusty-rose-detail.jpg",
    ],
    description: "Plush velvet cushion in dusty rose",
    longDescription:
      "Add a touch of luxury to your space with our sumptuous velvet cushion. The rich, lustrous fabric is made from sustainable cotton velvet, offering both comfort and environmental consciousness. The feather-down insert provides the perfect balance of softness and support, while the hidden zipper maintains clean lines.",
    materials: ["Cotton velvet cover", "Feather-down insert", "Hidden zipper closure"],
    care: ["Spot clean or dry clean", "Fluff regularly to maintain shape", "Store in breathable bag"],
    sizes: [
      { size: '18" x 18"', available: true },
      { size: '20" x 20"', available: true },
      { size: '12" x 20" Lumbar', available: true },
    ],
    colors: [
      { name: "Dusty Rose", hex: "#D4A5A5", available: true },
      { name: "Sage Green", hex: "#A5C4A5", available: true },
      { name: "Cream", hex: "#F5EDE8", available: true },
      { name: "Slate Blue", hex: "#A5B4C4", available: true },
    ],
    details: [
      "Premium cotton velvet",
      "Feather-down insert included",
      "Removable cover",
      "OEKO-TEX certified fabric",
    ],
    madeIn: "Portugal",
    dimensions: '18" x 18", 20" x 20", or 12" x 20"',
    weight: "1.5 lbs",
  },
  {
    id: "abstract-wall-art",
    name: "Abstract Canvas Art",
    price: 285,
    category: "Wall Art",
    images: [
      "/images/abstract-wall-art-front.jpg",
      "/images/abstract-wall-art-detail.jpg",
    ],
    description: "Hand-painted abstract art in pastel tones",
    longDescription:
      "Each canvas is an original work, hand-painted by our collective of emerging artists. The soft, organic forms and pastel palette create a sense of calm and contemplation, making this piece perfect for bedrooms, living spaces, or home offices. Stretched on a solid wood frame and ready to hang.",
    materials: ["Artist-grade acrylic paint", "Premium cotton canvas", "Solid wood stretcher frame"],
    care: ["Dust gently with soft brush", "Avoid direct sunlight", "Keep away from moisture"],
    sizes: [
      { size: '24" x 30"', available: true },
      { size: '30" x 40"', available: true },
      { size: '36" x 48"', available: false },
    ],
    colors: [
      { name: "Blush & Sage", hex: "#D4A5A5", available: true },
      { name: "Earth Tones", hex: "#D4C4A5", available: true },
      { name: "Ocean Blues", hex: "#A5C4D4", available: true },
    ],
    details: [
      "Original hand-painted artwork",
      "Certificate of authenticity",
      "Ready to hang hardware included",
      "Gallery-wrapped edges",
    ],
    madeIn: "Los Angeles, California",
    dimensions: '24" x 30" to 36" x 48"',
    weight: "3-6 lbs",
  },
  // … σιγουρέψου να προσθέσεις και τα υπόλοιπα προϊόντα όπως σε έστειλα
];

async function seed() {
  await dbConnect();
  try {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("✅ All products inserted successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
