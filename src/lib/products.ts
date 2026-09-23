// =====================================================================
// Creator — Product Catalog
// ---------------------------------------------------------------------
// To add a new product: duplicate any object below and change:
//   id, slug, name, price, oldPrice, category, images[], colors[],
//   sizes[], description, specs[], reviews[], stock, badge
// =====================================================================

export type Review = {
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  category:
    | "تيشيرتات"
    | "هوديز"
    | "جاكيتات"
    | "بناطيل"
    | "أحذية"
    | "إكسسوارات";
  images: string[]; // gallery images (first is main)
  colors: { name: string; hex: string }[];
  sizes: string[];
  rating: number;
  reviewsCount: number;
  badge?: "NEW" | "HOT" | "LIMITED";
  stock: number;
  description: string;
  specs: { label: string; value: string }[];
  reviews: Review[];
};

// Helper: stable Unsplash imagery for fashion photography.
// You can replace these URLs with your own assets (e.g. /images/p1.jpg).
const IMG = {
  // Hero image (top of homepage) — served from /public/hero.jpg
  // To replace: save your new image as public/hero.jpg (recommended size: 1920x1080 or larger)
  hero: "/hero.jpg",
  tee1:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80&auto=format&fit=crop",
  tee2:
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=80&auto=format&fit=crop",
  hoodie1:
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=80&auto=format&fit=crop",
  hoodie2:
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=900&q=80&auto=format&fit=crop",
  jacket1:
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=80&auto=format&fit=crop",
  jacket2:
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80&auto=format&fit=crop",
  pants1:
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=80&auto=format&fit=crop",
  pants2:
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=80&auto=format&fit=crop",
  shoes1:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80&auto=format&fit=crop",
  shoes2:
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900&q=80&auto=format&fit=crop",
  acc1:
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80&auto=format&fit=crop",
  acc2:
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&q=80&auto=format&fit=crop",
  acc3:
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=900&q=80&auto=format&fit=crop",
  related1:
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&q=80&auto=format&fit=crop",
  related2:
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80&auto=format&fit=crop",
  related3:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80&auto=format&fit=crop",
};

const defaultColors = [
  { name: "أسود", hex: "#0b0b0b" },
  { name: "أبيض", hex: "#f5f5f5" },
  { name: "ذهبي", hex: "#d4af37" },
];

const defaultSizes = ["S", "M", "L", "XL", "XXL"];

const sampleReviews: Review[] = [
  {
    author: "أحمد م.",
    rating: 5,
    comment: "خامة ممتازة وتصميم أنيق جداً، يستحق كل ريال.",
    date: "2025-11-02",
  },
  {
    author: "سارة ع.",
    rating: 4,
    comment: "المقاس مضبوط والقماش فاخر، التوصيل كان سريع.",
    date: "2025-10-18",
  },
  {
    author: "خالد ر.",
    rating: 5,
    comment: "جودة عالية جداً، سأطلب قطع أخرى بالتأكيد.",
    date: "2025-09-27",
  },
];

const defaultSpecs = [
  { label: "الخامة", value: "قطن مصري 100%" },
  { label: "الوزن", value: "280 جم" },
  { label: "المنشأ", value: "مصنوع بعناية في إيطاليا" },
  { label: "العناية", value: "غسيل بارد، لا تستخدم المبيّض" },
  { label: "الضمان", value: "سنة كاملة ضد عيوب الصناعة" },
];

export const products: Product[] = [
  {
    id: 1,
    slug: "vior-essential-tee-black",
    name: "تيشيرت HASSAN MAHMOUD إسنشل",
    price: 249,
    oldPrice: 329,
    category: "تيشيرتات",
    images: [IMG.tee1, IMG.tee2, IMG.related1],
    colors: defaultColors,
    sizes: defaultSizes,
    rating: 4.8,
    reviewsCount: 128,
    badge: "NEW",
    stock: 24,
    description:
      "تيشيرت بقصة عصرية من القطن المصري الفاخر، مطرّز بشعار Creator الذهبي. قطعة أساسية في خزانة كل رجل عصري يبحث عن الأناقة البسيطة والراحة المطلقة.",
    specs: defaultSpecs,
    reviews: sampleReviews,
  },
  {
    id: 2,
    slug: "vior-signature-hoodie",
    name: "هودي HASSAN MAHMOUD سيجنتشر",
    price: 489,
    category: "هوديز",
    images: [IMG.hoodie1, IMG.hoodie2, IMG.related2],
    colors: [
      { name: "أسود", hex: "#0b0b0b" },
      { name: "رمادي", hex: "#3a3a3a" },
      { name: "كريمي", hex: "#e9dfc8" },
    ],
    sizes: defaultSizes,
    rating: 4.9,
    reviewsCount: 214,
    badge: "HOT",
    stock: 12,
    description:
      "هودي ثقيل بقصة واسعة من قماش فليس مبطن، يمنحك الدفء والأناقة في آنٍ واحد. مثالي للإطلالات اليومية والفخامة غير الرسمية.",
    specs: defaultSpecs,
    reviews: sampleReviews,
  },
  {
    id: 3,
    slug: "vior-noir-jacket",
    name: "جاكيت HASSAN MAHMOUD نوار",
    price: 899,
    oldPrice: 1199,
    category: "جاكيتات",
    images: [IMG.jacket1, IMG.jacket2, IMG.related3],
    colors: [
      { name: "أسود", hex: "#0b0b0b" },
      { name: "بني داكن", hex: "#2b1d10" },
    ],
    sizes: ["M", "L", "XL", "XXL"],
    rating: 5.0,
    reviewsCount: 86,
    badge: "LIMITED",
    stock: 6,
    description:
      "جاكيت جلد صناعي فاخر بتصميم مستوحى من شوارع باريس، يجمع بين الحداثة والكلاسيكية بلمسة ذهبية مميزة.",
    specs: defaultSpecs,
    reviews: sampleReviews,
  },
  {
    id: 4,
    slug: "vior-cargo-pants",
    name: "بنطلون كارجو Creator",
    price: 399,
    category: "بناطيل",
    images: [IMG.pants1, IMG.pants2, IMG.related1],
    colors: defaultColors,
    sizes: ["30", "32", "34", "36", "38"],
    rating: 4.7,
    reviewsCount: 94,
    stock: 18,
    description:
      "بنطلون كارجو بقصة مريحة وجيوب وظيفية، مصنوع من قماش متين وناعم يمنحك حركة حرة طوال اليوم.",
    specs: defaultSpecs,
    reviews: sampleReviews,
  },
  {
    id: 5,
    slug: "vior-runner-x",
    name: "حذاء HASSAN MAHMOUD Runner X",
    price: 749,
    oldPrice: 899,
    category: "أحذية",
    images: [IMG.shoes1, IMG.shoes2, IMG.related2],
    colors: [
      { name: "أسود/ذهبي", hex: "#0b0b0b" },
      { name: "أبيض", hex: "#f5f5f5" },
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    rating: 4.9,
    reviewsCount: 302,
    badge: "HOT",
    stock: 22,
    description:
      "حذاء رياضي فاخر بنعل مبطن بتقنية امتصاص الصدمات، تصميم يمزج بين الأداء الرياضي واللمسة الفاخرة.",
    specs: defaultSpecs,
    reviews: sampleReviews,
  },
  {
    id: 6,
    slug: "vior-gold-watch",
    name: "ساعة HASSAN MAHMOUD الذهبية",
    price: 1299,
    category: "إكسسوارات",
    images: [IMG.acc1, IMG.acc3, IMG.related3],
    colors: [
      { name: "ذهبي", hex: "#d4af37" },
      { name: "فضي", hex: "#c0c0c0" },
    ],
    sizes: ["حجم واحد"],
    rating: 5.0,
    reviewsCount: 57,
    badge: "LIMITED",
    stock: 8,
    description:
      "ساعة يد فاخرة بإطار ذهبي لامع وحركة سويسرية دقيقة، اللمسة الأخيرة التي تكمل إطلالتك الراقية.",
    specs: defaultSpecs,
    reviews: sampleReviews,
  },
  {
    id: 7,
    slug: "vior-graphic-tee",
    name: "تيشيرت HASSAN MAHMOUD بطبعة",
    price: 229,
    category: "تيشيرتات",
    images: [IMG.tee2, IMG.tee1, IMG.related1],
    colors: defaultColors,
    sizes: defaultSizes,
    rating: 4.6,
    reviewsCount: 76,
    stock: 30,
    description:
      "تيشيرت بطبعة فنية حصرية من تصميم استوديو HASSAN MAHMOUD، قماش ناعم وقصة مريحة تناسب كل المناسبات.",
    specs: defaultSpecs,
    reviews: sampleReviews,
  },
  {
    id: 8,
    slug: "vior-zip-hoodie",
    name: "هودي بسحاب Creator",
    price: 529,
    category: "هوديز",
    images: [IMG.hoodie2, IMG.hoodie1, IMG.related2],
    colors: defaultColors,
    sizes: defaultSizes,
    rating: 4.8,
    reviewsCount: 118,
    badge: "NEW",
    stock: 15,
    description:
      "هودي بسحاب أمامي معدني ذهبي، بتصميم يجمع بين الأناقة والعملية مع جيوب جانبية واسعة.",
    specs: defaultSpecs,
    reviews: sampleReviews,
  },
  {
    id: 9,
    slug: "vior-leather-bag",
    name: "حقيبة جلد Creator",
    price: 899,
    oldPrice: 1099,
    category: "إكسسوارات",
    images: [IMG.acc2, IMG.acc1, IMG.related3],
    colors: [
      { name: "أسود", hex: "#0b0b0b" },
      { name: "بني", hex: "#4a2e1a" },
    ],
    sizes: ["حجم واحد"],
    rating: 4.9,
    reviewsCount: 41,
    stock: 10,
    description:
      "حقيبة يد من الجلد الطبيعي بتصميم عصري، مساحة داخلية منظمة وحزام قابل للتعديل.",
    specs: defaultSpecs,
    reviews: sampleReviews,
  },
  {
    id: 10,
    slug: "vior-classic-sneakers",
    name: "حذاء HASSAN MAHMOUD كلاسيك",
    price: 649,
    category: "أحذية",
    images: [IMG.shoes2, IMG.shoes1, IMG.related2],
    colors: defaultColors,
    sizes: ["40", "41", "42", "43", "44"],
    rating: 4.7,
    reviewsCount: 189,
    stock: 20,
    description:
      "حذاء كلاسيكي بتصميم أنيق ونعل مريح، مثالي للإطلالات اليومية شبه الرسمية.",
    specs: defaultSpecs,
    reviews: sampleReviews,
  },
  {
    id: 11,
    slug: "vior-bomber-jacket",
    name: "جاكيت بومبر Creator",
    price: 779,
    category: "جاكيتات",
    images: [IMG.jacket2, IMG.jacket1, IMG.related3],
    colors: defaultColors,
    sizes: ["M", "L", "XL"],
    rating: 4.8,
    reviewsCount: 63,
    badge: "NEW",
    stock: 11,
    description:
      "جاكيت بومبر بقصة قصيرة أنيقة، خامة خفيفة ومقاومة للرياح مع تفاصيل ذهبية فاخرة.",
    specs: defaultSpecs,
    reviews: sampleReviews,
  },
  {
    id: 12,
    slug: "vior-jogger-pants",
    name: "بنطلون جوغر Creator",
    price: 349,
    category: "بناطيل",
    images: [IMG.pants2, IMG.pants1, IMG.related1],
    colors: defaultColors,
    sizes: ["S", "M", "L", "XL"],
    rating: 4.6,
    reviewsCount: 142,
    stock: 26,
    description:
      "بنطلون جوغر مريح بقصة ضيقة عند الكاحل، قماش مرن يسمح بحرية الحركة مع لمسة عصرية.",
    specs: defaultSpecs,
    reviews: sampleReviews,
  },
];

export const CATEGORIES = [
  "الكل",
  "تيشيرتات",
  "هوديز",
  "جاكيتات",
  "بناطيل",
  "أحذية",
  "إكسسوارات",
] as const;

export const getProductById = (id: number) =>
  products.find((p) => p.id === id);

export const getRelatedProducts = (p: Product, limit = 4) =>
  products.filter((x) => x.id !== p.id && x.category === p.category).slice(0, limit);

export const HERO_IMAGE = "/hero.jpg";
