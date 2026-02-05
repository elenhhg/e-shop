export const products = [
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
  {
    id: "ceramic-table-lamp",
    name: "Ceramic Table Lamp",
    price: 245,
    category: "Lighting",
    images: [
      "/images/ceramic-table-lamp-front.jpg",
      "/images/ceramic-table-lamp-detail.jpg",
    ],
    description: "Handcrafted ceramic lamp with linen shade",
    longDescription:
      "This elegant table lamp features a hand-thrown ceramic base with a subtle textured finish, paired with a natural linen drum shade that diffuses light beautifully. The warm glow creates an inviting atmosphere perfect for bedside tables, living rooms, or home offices. Each lamp is individually crafted, ensuring no two are exactly alike.",
    materials: ["Hand-thrown ceramic base", "Natural linen shade", "Brass-finished hardware"],
    care: ["Dust with soft dry cloth", "Do not use water on ceramic base", "Replace bulbs with LED recommended"],
    sizes: [
      { size: "Standard (18in)", available: true },
      { size: "Tall (24in)", available: true },
    ],
    colors: [
      { name: "Cream", hex: "#F5EDE8", available: true },
      { name: "Sage", hex: "#A5C4A5", available: true },
      { name: "Charcoal", hex: "#4A4A4A", available: true },
    ],
    details: [
      "3-way switch dimming",
      "Compatible with smart bulbs",
      "UL listed for safety",
      "Natural linen shade included",
    ],
    madeIn: "North Carolina",
    dimensions: "18-24 inches tall, 12 inch shade",
    weight: "5.5 lbs",
  },
  {
    id: "wooden-serving-tray",
    name: "Oak Serving Tray",
    price: 95,
    category: "Accessories",
    images: [
      "/images/wooden-serving-tray-front.jpg",
      "/images/wooden-serving-tray-detail.jpg",
    ],
    description: "Handcrafted oak tray with rounded edges",
    longDescription:
      "Crafted from sustainably sourced white oak, this serving tray combines functionality with beautiful design. The gently rounded edges and smooth finish make it comfortable to carry, while brass inlay handles add a touch of elegance. Perfect for serving breakfast in bed, organizing vanity essentials, or displaying decorative items.",
    materials: ["Solid white oak", "Food-safe mineral oil finish", "Brass inlay handles"],
    care: ["Hand wash with mild soap", "Dry immediately", "Condition with food-safe oil periodically"],
    sizes: [
      { size: '14" x 10"', available: true },
      { size: '18" x 12"', available: true },
      { size: '22" x 14"', available: false },
    ],
    colors: [
      { name: "Natural Oak", hex: "#D4C4A5", available: true },
      { name: "Walnut Stain", hex: "#8B7355", available: true },
    ],
    details: [
      "Sustainably sourced wood",
      "Food-safe finish",
      "Brass handle inlays",
      "Each grain pattern unique",
    ],
    madeIn: "Vermont",
    dimensions: '14" x 10" to 22" x 14"',
    weight: "2 lbs",
  },
  {
    id: "woven-storage-basket",
    name: "Seagrass Storage Basket",
    price: 75,
    category: "Storage",
    images: [
      "/images/woven-storage-basket-front.jpg",
      "/images/woven-storage-basket-detail.jpg",
    ],
    description: "Handwoven seagrass basket for stylish storage",
    longDescription:
      "These beautiful baskets are handwoven by artisan cooperatives using sustainably harvested seagrass. The natural variation in color and texture makes each piece unique. Use them to organize throw blankets, magazines, toys, or plants. The sturdy construction ensures years of daily use while adding warmth and texture to any room.",
    materials: ["Natural seagrass", "Reinforced metal frame", "Cotton lining (lined version)"],
    care: ["Dust with soft brush or vacuum", "Keep in dry environment", "Spot clean if needed"],
    sizes: [
      { size: "Small (10in)", available: true },
      { size: "Medium (14in)", available: true },
      { size: "Large (18in)", available: true },
    ],
    colors: [
      { name: "Natural", hex: "#E8D5C4", available: true },
      { name: "Black Accent", hex: "#4A4A4A", available: true },
    ],
    details: [
      "Handwoven by artisan cooperatives",
      "Fair trade certified",
      "Reinforced for durability",
      "Nested storage for space saving",
    ],
    madeIn: "Vietnam",
    dimensions: "10-18 inches diameter",
    weight: "0.8 - 1.5 lbs",
  },
  {
    id: "scented-candle",
    name: "Botanical Scented Candle",
    price: 48,
    category: "Fragrance",
    images: [
      "/images/scented-candle-front.jpg",
      "/images/scented-candle-detail.jpg",
    ],
    description: "Hand-poured soy candle with essential oils",
    longDescription:
      "Our signature candle is hand-poured using 100% natural soy wax and pure essential oil blends. The cotton wick ensures a clean, even burn with no soot. Each candle burns for approximately 60 hours, filling your space with subtle, sophisticated fragrance. The minimalist glass vessel can be repurposed after use.",
    materials: ["100% natural soy wax", "Pure essential oil blend", "Cotton wick", "Recyclable glass vessel"],
    care: ["Trim wick to 1/4 inch before each use", "Burn until wax pools to edges", "Never leave unattended"],
    sizes: [
      { size: "8 oz", available: true },
      { size: "12 oz", available: true },
    ],
    colors: [
      { name: "Eucalyptus & Cedar", hex: "#A5C4A5", available: true },
      { name: "Lavender & Vanilla", hex: "#C4A5D4", available: true },
      { name: "Bergamot & Sage", hex: "#D4C4A5", available: true },
      { name: "Rose & Sandalwood", hex: "#D4A5A5", available: true },
    ],
    details: [
      "60+ hour burn time",
      "Non-toxic soy wax",
      "Phthalate-free fragrance",
      "Reusable glass vessel",
    ],
    madeIn: "Brooklyn, New York",
    dimensions: '3.5" diameter x 4" height',
    weight: "1 lb",
  },
]

export const categories = ["All", "Vases", "Textiles", "Lighting", "Wall Art", "Accessories", "Storage", "Fragrance"]

export const priceRanges = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "Over $200", min: 200, max: Infinity },
]

export const materials = ["Ceramic", "Linen", "Brass", "Velvet", "Wood", "Seagrass", "Soy Wax"]

export function getProductById(id) {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(category) {
  if (category === "All") return products
  return products.filter((p) => p.category === category)
}

export function getProductsByPriceRange(min, max) {
  return products.filter((p) => p.price >= min && p.price <= max)
}

export function getRelatedProducts(currentId, limit = 4) {
  const current = getProductById(currentId)
  if (!current) return products.slice(0, limit)

  const sameCategory = products.filter((p) => p.id !== currentId && p.category === current.category)
  const others = products.filter((p) => p.id !== currentId && p.category !== current.category)

  return [...sameCategory, ...others].slice(0, limit)
}
