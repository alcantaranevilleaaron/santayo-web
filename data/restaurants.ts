import type { Restaurant } from "./restaurant.types"

export type { Restaurant }

export const RESTAURANTS: Restaurant[] = [
  {
    id: 1,
    name: "Manam",
    area: "SM Aura",
    cuisine: "Filipino",
    priceRange: "₱350-600",
    dishes: [
      "House Crispy Sisig",
      "Sinigang na Beef Short Rib",
      "Kare-Kare"
    ],
    tags: [
      "comfort",
      "filling",
      "filipino"
    ],
    attributes: [
      "comfort",
      "filling",
      "filipino",
      "pair",
      "group"
    ],
    budgetMax: 600,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "manam-sm-aura-1",
    cuisinePrimary: "Filipino",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 350,
    priceBucket: "mid"
  },
  {
    id: 2,
    name: "Jin Joo Korean Grill",
    area: "SM Aura",
    cuisine: "Korean",
    priceRange: "₱500-900",
    dishes: [
      "Bibimbap",
      "Samgyeopsal",
      "Bulgogi"
    ],
    tags: [
      "filling",
      "comfort",
      "korean"
    ],
    attributes: [
      "filling",
      "comfort",
      "korean",
      "pair",
      "group"
    ],
    budgetMax: 1000,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "jin-joo-korean-grill-sm-aura-2",
    cuisinePrimary: "Korean",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Filling",
      "Comfort"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 500,
    priceBucket: "premium"
  },
  {
    id: 3,
    name: "Wildflour Cafe + Bakery",
    area: "BGC",
    cuisine: "Cafe",
    priceRange: "₱400-700",
    dishes: [
      "Brioche French Toast",
      "Truffle Cream Pasta",
      "Croissant"
    ],
    tags: [
      "light",
      "comfort",
      "cafe"
    ],
    attributes: [
      "light",
      "comfort",
      "cafe",
      "solo",
      "pair"
    ],
    budgetMax: 1000,
    diningTypes: [
      "solo",
      "pair"
    ],
    slug: "wildflour-cafe-bakery-bgc-3",
    cuisinePrimary: "Cafe",
    foodCategories: [
      "Cafe"
    ],
    moodTags: [
      "Light",
      "Comfort"
    ],
    experienceTags: [
      "Solo"
    ],
    budgetMin: 400,
    priceBucket: "premium"
  },
  {
    id: 4,
    name: "Tokyo Milk Cheese Factory",
    area: "Mitsukoshi",
    cuisine: "Japanese",
    priceRange: "₱150-300",
    dishes: [
      "Cheese Tart",
      "Milk Soft Serve",
      "Salt & Camembert Cookies"
    ],
    tags: [
      "light",
      "japanese",
      "dessert"
    ],
    attributes: [
      "light",
      "japanese",
      "dessert",
      "solo",
      "pair"
    ],
    budgetMax: 400,
    diningTypes: [
      "solo",
      "pair"
    ],
    slug: "tokyo-milk-cheese-factory-mitsukoshi-4",
    cuisinePrimary: "Japanese",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Light"
    ],
    experienceTags: [
      "Solo"
    ],
    budgetMin: 150,
    priceBucket: "budget"
  },
  {
    id: 5,
    name: "Locavore",
    area: "Forbes Town Center",
    cuisine: "Filipino",
    priceRange: "₱300-550",
    dishes: [
      "Sizzling Sinigang",
      "Lechon and Oyster Sisig",
      "Prawns"
    ],
    tags: [
      "comfort",
      "filling",
      "filipino"
    ],
    attributes: [
      "comfort",
      "filling",
      "filipino",
      "pair",
      "group"
    ],
    budgetMax: 600,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "locavore-forbes-town-center-5",
    cuisinePrimary: "Filipino",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 300,
    priceBucket: "mid"
  },
  {
    id: 6,
    name: "Shake Shack",
    area: "Uptown Mall",
    cuisine: "Western",
    priceRange: "₱250-450",
    dishes: [
      "ShackBurger",
      "Crinkle Cut Fries",
      "Frozen Custard"
    ],
    tags: [
      "comfort",
      "filling",
      "western"
    ],
    attributes: [
      "comfort",
      "filling",
      "western",
      "solo",
      "pair",
      "group"
    ],
    budgetMax: 600,
    diningTypes: [
      "solo",
      "pair",
      "group"
    ],
    slug: "shake-shack-uptown-mall-6",
    cuisinePrimary: "Western",
    foodCategories: [
      "Western"
    ],
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Solo",
      "Group"
    ],
    budgetMin: 250,
    priceBucket: "mid"
  },
  {
    id: 7,
    name: "Brick Corner",
    area: "BGC",
    cuisine: "Indian",
    priceRange: "₱300-550",
    dishes: [
      "Butter Chicken",
      "Tandoori",
      "Biryani"
    ],
    tags: [
      "comfort",
      "filling",
      "indian"
    ],
    attributes: [
      "comfort",
      "filling",
      "indian",
      "solo",
      "pair",
      "group"
    ],
    budgetMax: 600,
    diningTypes: [
      "solo",
      "pair",
      "group"
    ],
    slug: "brick-corner-bgc-7",
    cuisinePrimary: "Indian",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Solo",
      "Group"
    ],
    budgetMin: 300,
    priceBucket: "mid"
  },
  {
    id: 8,
    name: "SaladStop!",
    area: "Bonifacio High Street",
    cuisine: "Healthy",
    priceRange: "₱220-380",
    dishes: [
      "Protein Bowl",
      "Caesar Salad",
      "Wrap"
    ],
    tags: [
      "healthy",
      "light"
    ],
    attributes: [
      "healthy",
      "light",
      "solo"
    ],
    budgetMax: 400,
    diningTypes: [
      "solo"
    ],
    slug: "saladstop-bonifacio-high-street-8",
    cuisinePrimary: "Healthy",
    foodCategories: [
      "Healthy"
    ],
    moodTags: [
      "Healthy",
      "Light"
    ],
    experienceTags: [
      "Solo"
    ],
    budgetMin: 220,
    priceBucket: "budget"
  },
  {
    id: 9,
    name: "Ramen Nagi",
    area: "SM Aura",
    cuisine: "Japanese",
    priceRange: "₱380-550",
    dishes: [
      "Butao King",
      "Black King",
      "Gyoza"
    ],
    tags: [
      "filling",
      "comfort",
      "japanese"
    ],
    attributes: [
      "filling",
      "comfort",
      "japanese",
      "solo",
      "pair"
    ],
    budgetMax: 600,
    diningTypes: [
      "solo",
      "pair"
    ],
    slug: "ramen-nagi-sm-aura-9",
    cuisinePrimary: "Japanese",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Filling",
      "Comfort"
    ],
    experienceTags: [
      "Solo"
    ],
    budgetMin: 380,
    priceBucket: "mid"
  },
  {
    id: 10,
    name: "Señor Pollo",
    area: "Bonifacio High Street",
    cuisine: "Western",
    priceRange: "₱200-350",
    dishes: [
      "Rotisserie Chicken",
      "Aji Verde Rice",
      "Plantains"
    ],
    tags: [
      "filling",
      "comfort",
      "western"
    ],
    attributes: [
      "filling",
      "comfort",
      "western",
      "solo",
      "pair",
      "group"
    ],
    budgetMax: 400,
    diningTypes: [
      "solo",
      "pair",
      "group"
    ],
    slug: "se-or-pollo-bonifacio-high-street-10",
    cuisinePrimary: "Western",
    foodCategories: [
      "Western"
    ],
    moodTags: [
      "Filling",
      "Comfort"
    ],
    experienceTags: [
      "Solo",
      "Group"
    ],
    budgetMin: 200,
    priceBucket: "budget"
  },
  {
    id: 11,
    name: "Bondi & Bourke",
    area: "Bonifacio High Street Central",
    cuisine: "Western",
    priceRange: "₱350-650",
    dishes: [
      "Steak and Eggs",
      "Chicken Parmigiana",
      "Flat White"
    ],
    tags: [
      "light",
      "comfort",
      "western"
    ],
    attributes: [
      "light",
      "comfort",
      "western",
      "solo",
      "pair"
    ],
    budgetMax: 1000,
    diningTypes: [
      "solo",
      "pair"
    ],
    slug: "bondi-bourke-bonifacio-high-street-central-11",
    cuisinePrimary: "Western",
    foodCategories: [
      "Western"
    ],
    moodTags: [
      "Light",
      "Comfort"
    ],
    experienceTags: [
      "Solo"
    ],
    budgetMin: 350,
    priceBucket: "premium"
  },
  {
    id: 12,
    name: "Mesa",
    area: "SM Aura",
    cuisine: "Filipino",
    priceRange: "₱350-650",
    dishes: [
      "Crispy Boneless Pata",
      "Tinapa Rice",
      "Beef Caldereta"
    ],
    tags: [
      "comfort",
      "filling",
      "filipino"
    ],
    attributes: [
      "comfort",
      "filling",
      "filipino",
      "pair",
      "group"
    ],
    budgetMax: 1000,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "mesa-sm-aura-12",
    cuisinePrimary: "Filipino",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 350,
    priceBucket: "premium"
  },
  {
    id: 13,
    name: "Din Tai Fung",
    area: "Bonifacio High Street",
    cuisine: "Chinese",
    priceRange: "₱450-800",
    dishes: [
      "Xiao Long Bao",
      "Pork Chop Fried Rice",
      "Shrimp and Pork Wontons"
    ],
    tags: [
      "filling",
      "comfort",
      "chinese"
    ],
    attributes: [
      "filling",
      "comfort",
      "chinese",
      "pair",
      "group"
    ],
    budgetMax: 1000,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "din-tai-fung-bonifacio-high-street-13",
    cuisinePrimary: "Chinese",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Filling",
      "Comfort"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 450,
    priceBucket: "premium"
  },
  {
    id: 14,
    name: "Tim Ho Wan",
    area: "SM Aura",
    cuisine: "Chinese",
    priceRange: "₱250-450",
    dishes: [
      "Baked BBQ Pork Buns",
      "Hakaw",
      "Siu Mai"
    ],
    tags: [
      "light",
      "filling",
      "chinese"
    ],
    attributes: [
      "light",
      "filling",
      "chinese",
      "solo",
      "pair",
      "group"
    ],
    budgetMax: 600,
    diningTypes: [
      "solo",
      "pair",
      "group"
    ],
    slug: "tim-ho-wan-sm-aura-14",
    cuisinePrimary: "Chinese",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Light",
      "Filling"
    ],
    experienceTags: [
      "Solo",
      "Group"
    ],
    budgetMin: 250,
    priceBucket: "mid"
  },
  {
    id: 15,
    name: "Mendokoro Ramenba",
    area: "Mitsukoshi",
    cuisine: "Japanese",
    priceRange: "₱450-600",
    dishes: [
      "Shio Ramen",
      "Shoyu Ramen",
      "Gyoza"
    ],
    tags: [
      "filling",
      "comfort",
      "japanese"
    ],
    attributes: [
      "filling",
      "comfort",
      "japanese",
      "solo",
      "pair"
    ],
    budgetMax: 600,
    diningTypes: [
      "solo",
      "pair"
    ],
    slug: "mendokoro-ramenba-mitsukoshi-15",
    cuisinePrimary: "Japanese",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Filling",
      "Comfort"
    ],
    experienceTags: [
      "Solo"
    ],
    budgetMin: 450,
    priceBucket: "mid"
  },
  {
    id: 16,
    name: "Marugame Udon",
    area: "Bonifacio High Street",
    cuisine: "Japanese",
    priceRange: "₱180-300",
    dishes: [
      "Kake Udon",
      "Beef Ontama Bukkake",
      "Tempura"
    ],
    tags: [
      "light",
      "filling",
      "japanese"
    ],
    attributes: [
      "light",
      "filling",
      "japanese",
      "solo",
      "pair"
    ],
    budgetMax: 400,
    diningTypes: [
      "solo",
      "pair"
    ],
    slug: "marugame-udon-bonifacio-high-street-16",
    cuisinePrimary: "Japanese",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Light",
      "Filling"
    ],
    experienceTags: [
      "Solo"
    ],
    budgetMin: 180,
    priceBucket: "budget"
  },
  {
    id: 17,
    name: "Nono's",
    area: "Uptown Mall",
    cuisine: "Western",
    priceRange: "₱350-650",
    dishes: [
      "Fried Truffle Cheese Wontons",
      "Nono's Homestyle Fried Chicken",
      "Chocolate Oblivion"
    ],
    tags: [
      "comfort",
      "filling",
      "western"
    ],
    attributes: [
      "comfort",
      "filling",
      "western",
      "pair",
      "group"
    ],
    budgetMax: 1000,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "nono-s-uptown-mall-17",
    cuisinePrimary: "Western",
    foodCategories: [
      "Western"
    ],
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 350,
    priceBucket: "premium"
  },
  {
    id: 18,
    name: "Frankie's New York Buffalo Wings",
    area: "BGC",
    cuisine: "Western",
    priceRange: "₱220-380",
    dishes: [
      "Buffalo Wings",
      "Salted Egg Wings",
      "Fries"
    ],
    tags: [
      "filling",
      "western"
    ],
    attributes: [
      "filling",
      "western",
      "solo",
      "pair",
      "group"
    ],
    budgetMax: 400,
    diningTypes: [
      "solo",
      "pair",
      "group"
    ],
    slug: "frankie-s-new-york-buffalo-wings-bgc-18",
    cuisinePrimary: "Western",
    foodCategories: [
      "Western"
    ],
    moodTags: [
      "Filling"
    ],
    experienceTags: [
      "Solo",
      "Group"
    ],
    budgetMin: 220,
    priceBucket: "budget"
  },
  {
    id: 19,
    name: "Sunnies Cafe",
    area: "Bonifacio High Street",
    cuisine: "Cafe",
    priceRange: "₱300-550",
    dishes: [
      "Pancakes",
      "Pasta",
      "Coffee"
    ],
    tags: [
      "light",
      "comfort",
      "cafe"
    ],
    attributes: [
      "light",
      "comfort",
      "cafe",
      "solo",
      "pair"
    ],
    budgetMax: 600,
    diningTypes: [
      "solo",
      "pair"
    ],
    slug: "sunnies-cafe-bonifacio-high-street-19",
    cuisinePrimary: "Cafe",
    foodCategories: [
      "Cafe"
    ],
    moodTags: [
      "Light",
      "Comfort"
    ],
    experienceTags: [
      "Solo"
    ],
    budgetMin: 300,
    priceBucket: "mid"
  },
  {
    id: 20,
    name: "Recovery Food",
    area: "BGC",
    cuisine: "Filipino",
    priceRange: "₱180-320",
    dishes: [
      "Tapa de Morning",
      "Breakfast Burrito",
      "Charlie Chan"
    ],
    tags: [
      "comfort",
      "filling",
      "filipino"
    ],
    attributes: [
      "comfort",
      "filling",
      "filipino",
      "solo",
      "pair"
    ],
    budgetMax: 400,
    diningTypes: [
      "solo",
      "pair"
    ],
    slug: "recovery-food-bgc-20",
    cuisinePrimary: "Filipino",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Solo"
    ],
    budgetMin: 180,
    priceBucket: "budget"
  },
  {
    id: 21,
    name: "Elephant Grounds",
    area: "One Bonifacio High Street",
    cuisine: "Cafe",
    priceRange: "₱250-450",
    dishes: [
      "Egg Sando",
      "Ice Cream Sandwich",
      "Coffee"
    ],
    tags: [
      "light",
      "cafe"
    ],
    attributes: [
      "light",
      "cafe",
      "solo",
      "pair"
    ],
    budgetMax: 600,
    diningTypes: [
      "solo",
      "pair"
    ],
    slug: "elephant-grounds-one-bonifacio-high-street-21",
    cuisinePrimary: "Cafe",
    foodCategories: [
      "Cafe"
    ],
    moodTags: [
      "Light"
    ],
    experienceTags: [
      "Solo"
    ],
    budgetMin: 250,
    priceBucket: "mid"
  },
  {
    id: 22,
    name: "8Cuts Burgers",
    area: "Serendra",
    cuisine: "Western",
    priceRange: "₱250-450",
    dishes: [
      "Cheeseburger",
      "Onion Rings",
      "Milkshake"
    ],
    tags: [
      "comfort",
      "filling",
      "western"
    ],
    attributes: [
      "comfort",
      "filling",
      "western",
      "solo",
      "pair",
      "group"
    ],
    budgetMax: 600,
    diningTypes: [
      "solo",
      "pair",
      "group"
    ],
    slug: "8cuts-burgers-serendra-22",
    cuisinePrimary: "Western",
    foodCategories: [
      "Western"
    ],
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Solo",
      "Group"
    ],
    budgetMin: 250,
    priceBucket: "mid"
  },
  {
    id: 23,
    name: "Hawker Chan",
    area: "One Bonifacio High Street",
    cuisine: "Chinese",
    priceRange: "₱180-320",
    dishes: [
      "Soy Chicken Rice",
      "Char Siew",
      "Noodles"
    ],
    tags: [
      "filling",
      "chinese"
    ],
    attributes: [
      "filling",
      "chinese",
      "solo",
      "pair"
    ],
    budgetMax: 400,
    diningTypes: [
      "solo",
      "pair"
    ],
    slug: "hawker-chan-one-bonifacio-high-street-23",
    cuisinePrimary: "Chinese",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Filling"
    ],
    experienceTags: [
      "Solo"
    ],
    budgetMin: 180,
    priceBucket: "budget"
  },
  {
    id: 24,
    name: "Ippudo",
    area: "Uptown Mall",
    cuisine: "Japanese",
    priceRange: "₱450-750",
    dishes: [
      "Shiromaru",
      "Akamaru",
      "Pork Buns"
    ],
    tags: [
      "comfort",
      "filling",
      "japanese"
    ],
    attributes: [
      "comfort",
      "filling",
      "japanese",
      "solo",
      "pair"
    ],
    budgetMax: 1000,
    diningTypes: [
      "solo",
      "pair"
    ],
    slug: "ippudo-uptown-mall-24",
    cuisinePrimary: "Japanese",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Solo"
    ],
    budgetMin: 450,
    priceBucket: "premium"
  },
  {
    id: 25,
    name: "Abe",
    area: "Serendra",
    cuisine: "Filipino",
    priceRange: "₱450-800",
    dishes: [
      "Bamboo Rice",
      "Crispy Adobo Flakes",
      "Lamb Adobo"
    ],
    tags: [
      "comfort",
      "filling",
      "filipino"
    ],
    attributes: [
      "comfort",
      "filling",
      "filipino",
      "pair",
      "group"
    ],
    budgetMax: 1000,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "abe-serendra-25",
    cuisinePrimary: "Filipino",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 450,
    priceBucket: "premium"
  },
  {
    id: 26,
    name: "Mary Grace Cafe",
    area: "Bonifacio High Street",
    cuisine: "Cafe",
    priceRange: "₱300-550",
    dishes: [
      "Cheese Rolls",
      "Chicken Inasal Pasta",
      "Hot Chocolate"
    ],
    tags: [
      "light",
      "comfort",
      "cafe"
    ],
    attributes: [
      "light",
      "comfort",
      "cafe",
      "solo",
      "pair"
    ],
    budgetMax: 600,
    diningTypes: [
      "solo",
      "pair"
    ],
    slug: "mary-grace-cafe-bonifacio-high-street-26",
    cuisinePrimary: "Cafe",
    foodCategories: [
      "Cafe"
    ],
    moodTags: [
      "Light",
      "Comfort"
    ],
    experienceTags: [
      "Solo"
    ],
    budgetMin: 300,
    priceBucket: "mid"
  },
  {
    id: 27,
    name: "Botejyu",
    area: "One Bonifacio High Street",
    cuisine: "Japanese",
    priceRange: "₱350-650",
    dishes: [
      "Okonomiyaki",
      "Takoyaki",
      "Ramen"
    ],
    tags: [
      "filling",
      "comfort",
      "japanese"
    ],
    attributes: [
      "filling",
      "comfort",
      "japanese",
      "pair",
      "group"
    ],
    budgetMax: 1000,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "botejyu-one-bonifacio-high-street-27",
    cuisinePrimary: "Japanese",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Filling",
      "Comfort"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 350,
    priceBucket: "premium"
  },
  {
    id: 28,
    name: "Greyhound Cafe",
    area: "SM Aura",
    cuisine: "Thai",
    priceRange: "₱350-650",
    dishes: [
      "Pad Thai",
      "Complicated Noodles",
      "Tom Yum"
    ],
    tags: [
      "light",
      "filling",
      "thai"
    ],
    attributes: [
      "light",
      "filling",
      "thai",
      "pair",
      "group"
    ],
    budgetMax: 1000,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "greyhound-cafe-sm-aura-28",
    cuisinePrimary: "Thai",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Light",
      "Filling"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 350,
    priceBucket: "premium"
  },
  {
    id: 29,
    name: "Ootoya",
    area: "Grand Hyatt Manila",
    cuisine: "Japanese",
    priceRange: "₱450-750",
    dishes: [
      "Teishoku Set",
      "Chicken Nanban",
      "Katsu"
    ],
    tags: [
      "comfort",
      "filling",
      "japanese"
    ],
    attributes: [
      "comfort",
      "filling",
      "japanese",
      "solo",
      "pair"
    ],
    budgetMax: 1000,
    diningTypes: [
      "solo",
      "pair"
    ],
    slug: "ootoya-grand-hyatt-manila-29",
    cuisinePrimary: "Japanese",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Solo"
    ],
    budgetMin: 450,
    priceBucket: "premium"
  },
  {
    id: 30,
    name: "Moderna",
    area: "Uptown Parade",
    cuisine: "Italian",
    priceRange: "₱500-900",
    dishes: [
      "Pasta",
      "Pizza",
      "Small Plates"
    ],
    tags: [
      "comfort",
      "filling",
      "italian"
    ],
    attributes: [
      "comfort",
      "filling",
      "italian",
      "pair",
      "group"
    ],
    budgetMax: 1000,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "moderna-uptown-parade-30",
    cuisinePrimary: "Italian",
    foodCategories: [
      "Western"
    ],
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 500,
    priceBucket: "premium"
  },
  {
    id: 31,
    name: "Burnt Bean",
    area: "Bonifacio High Street Central",
    cuisine: "Western",
    priceRange: "₱500-900",
    dishes: [
      "Steak",
      "Potato Pavé",
      "Flatbread Pizza"
    ],
    tags: [
      "comfort",
      "filling",
      "western"
    ],
    attributes: [
      "comfort",
      "filling",
      "western",
      "pair",
      "group"
    ],
    budgetMax: 1000,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "burnt-bean-bonifacio-high-street-central-31",
    cuisinePrimary: "Western",
    foodCategories: [
      "Western"
    ],
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 500,
    priceBucket: "premium"
  },
  {
    id: 32,
    name: "Amici",
    area: "One Bonifacio High Street",
    cuisine: "Italian",
    priceRange: "₱250-450",
    dishes: [
      "Pizza",
      "Pasta",
      "Gelato"
    ],
    tags: [
      "comfort",
      "filling",
      "italian"
    ],
    attributes: [
      "comfort",
      "filling",
      "italian",
      "solo",
      "pair",
      "group"
    ],
    budgetMax: 600,
    diningTypes: [
      "solo",
      "pair",
      "group"
    ],
    slug: "amici-one-bonifacio-high-street-32",
    cuisinePrimary: "Italian",
    foodCategories: [
      "Western"
    ],
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Solo",
      "Group"
    ],
    budgetMin: 250,
    priceBucket: "mid"
  },
  {
    id: 33,
    name: "Bar Pintxos",
    area: "BGC",
    cuisine: "Spanish",
    priceRange: "₱500-900",
    dishes: [
      "Pintxos",
      "Paella",
      "Sangria"
    ],
    tags: [
      "light",
      "group",
      "spanish"
    ],
    attributes: [
      "light",
      "group",
      "spanish",
      "pair"
    ],
    budgetMax: 1000,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "bar-pintxos-bgc-33",
    moodTags: [
      "Light"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 500,
    priceBucket: "premium"
  },
  {
    id: 34,
    name: "Lore by Chef Tatung",
    area: "One Bonifacio High Street",
    cuisine: "Filipino",
    priceRange: "₱600-1000",
    dishes: [
      "Modern Filipino Plates",
      "Rice Bowls",
      "Desserts"
    ],
    tags: [
      "comfort",
      "filipino",
      "sosyal"
    ],
    attributes: [
      "comfort",
      "filipino",
      "premium",
      "pair",
      "group"
    ],
    budgetMax: 1000,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "lore-by-chef-tatung-one-bonifacio-high-street-34",
    cuisinePrimary: "Filipino",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Comfort"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 600,
    priceBucket: "premium"
  },
  {
    id: 35,
    name: "Italianni's",
    area: "Bonifacio High Street",
    cuisine: "Italian",
    priceRange: "₱400-750",
    dishes: [
      "Spaghetti and Meatballs",
      "Pizza",
      "Chicken Parmesan"
    ],
    tags: [
      "comfort",
      "filling",
      "italian"
    ],
    attributes: [
      "comfort",
      "filling",
      "italian",
      "pair",
      "group"
    ],
    budgetMax: 1000,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "italianni-s-bonifacio-high-street-35",
    cuisinePrimary: "Italian",
    foodCategories: [
      "Western"
    ],
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 400,
    priceBucket: "premium"
  },
  {
    id: 36,
    name: "Wolfgang's Steakhouse",
    area: "BGC",
    cuisine: "Western",
    priceRange: "₱1000+",
    dishes: [
      "USDA Prime Steak",
      "Creamed Spinach",
      "Mashed Potatoes"
    ],
    tags: [
      "filling",
      "western",
      "sosyal"
    ],
    attributes: [
      "filling",
      "western",
      "premium",
      "pair",
      "group"
    ],
    budgetMax: 1000,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "wolfgang-s-steakhouse-bgc-36",
    cuisinePrimary: "Western",
    foodCategories: [
      "Western"
    ],
    moodTags: [
      "Filling"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 1000,
    priceBucket: "premium"
  },
  {
    id: 37,
    name: "Smith & Wollensky",
    area: "Finance Centre",
    cuisine: "Western",
    priceRange: "₱1000+",
    dishes: [
      "Ribeye",
      "Steakhouse Sides",
      "Cocktails"
    ],
    tags: [
      "filling",
      "western",
      "sosyal"
    ],
    attributes: [
      "filling",
      "western",
      "premium",
      "pair",
      "group"
    ],
    budgetMax: 1000,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "smith-wollensky-finance-centre-37",
    cuisinePrimary: "Western",
    foodCategories: [
      "Western"
    ],
    moodTags: [
      "Filling"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 1000,
    priceBucket: "premium"
  },
  {
    id: 38,
    name: "Ruth's Chris Steak House",
    area: "BGC",
    cuisine: "Western",
    priceRange: "₱1000+",
    dishes: [
      "Filet",
      "Ribeye",
      "Sizzling Plates"
    ],
    tags: [
      "filling",
      "western",
      "sosyal"
    ],
    attributes: [
      "filling",
      "western",
      "premium",
      "pair",
      "group"
    ],
    budgetMax: 1000,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "ruth-s-chris-steak-house-bgc-38",
    cuisinePrimary: "Western",
    foodCategories: [
      "Western"
    ],
    moodTags: [
      "Filling"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 1000,
    priceBucket: "premium"
  },
  {
    id: 39,
    name: "NIU by Vikings",
    area: "SM Aura",
    cuisine: "Buffet",
    priceRange: "₱1000+",
    dishes: [
      "Seafood",
      "Roasts",
      "Dessert Station"
    ],
    tags: [
      "filling",
      "group"
    ],
    attributes: [
      "filling",
      "group",
      "buffet",
      "pair"
    ],
    budgetMax: 1000,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "niu-by-vikings-sm-aura-39",
    cuisinePrimary: "Buffet",
    foodCategories: [
      "Buffet"
    ],
    moodTags: [
      "Filling"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 1000,
    priceBucket: "premium"
  },
  {
    id: 40,
    name: "Texas Roadhouse",
    area: "Uptown Mall",
    cuisine: "Western",
    priceRange: "₱450-800",
    dishes: [
      "Steak",
      "Ribs",
      "Rolls"
    ],
    tags: [
      "comfort",
      "filling",
      "western"
    ],
    attributes: [
      "comfort",
      "filling",
      "western",
      "pair",
      "group"
    ],
    budgetMax: 1000,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "texas-roadhouse-uptown-mall-40",
    cuisinePrimary: "Western",
    foodCategories: [
      "Western"
    ],
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 450,
    priceBucket: "premium"
  },
  {
    id: 41,
    name: "Deli by Chele",
    area: "SM Aura",
    cuisine: "Western",
    priceRange: "₱250-450",
    dishes: [
      "Pastrami Sandwich",
      "Chorizo Sandwich",
      "Fries"
    ],
    tags: [
      "light",
      "filling",
      "western"
    ],
    attributes: [
      "light",
      "filling",
      "western",
      "solo",
      "pair"
    ],
    budgetMax: 600,
    diningTypes: [
      "solo",
      "pair"
    ],
    slug: "deli-by-chele-sm-aura-41",
    cuisinePrimary: "Western",
    foodCategories: [
      "Western"
    ],
    moodTags: [
      "Light",
      "Filling"
    ],
    experienceTags: [
      "Solo"
    ],
    budgetMin: 250,
    priceBucket: "mid"
  },
  {
    id: 42,
    name: "Teakha",
    area: "SM Aura",
    cuisine: "Chinese",
    priceRange: "₱250-450",
    dishes: [
      "Roasted Duck",
      "Char Siu",
      "Fried Rice"
    ],
    tags: [
      "filling",
      "chinese"
    ],
    attributes: [
      "filling",
      "chinese",
      "solo",
      "pair"
    ],
    budgetMax: 600,
    diningTypes: [
      "solo",
      "pair"
    ],
    slug: "teakha-sm-aura-42",
    cuisinePrimary: "Chinese",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Filling"
    ],
    experienceTags: [
      "Solo"
    ],
    budgetMin: 250,
    priceBucket: "mid"
  },
  {
    id: 43,
    name: "Le Chon Prime",
    area: "SM Aura",
    cuisine: "Filipino",
    priceRange: "₱250-450",
    dishes: [
      "Lechon Roll",
      "Sisig",
      "Pinoy Paella Rice"
    ],
    tags: [
      "comfort",
      "filling",
      "filipino"
    ],
    attributes: [
      "comfort",
      "filling",
      "filipino",
      "solo",
      "pair",
      "group"
    ],
    budgetMax: 600,
    diningTypes: [
      "solo",
      "pair",
      "group"
    ],
    slug: "le-chon-prime-sm-aura-43",
    cuisinePrimary: "Filipino",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Solo",
      "Group"
    ],
    budgetMin: 250,
    priceBucket: "mid"
  },
  {
    id: 44,
    name: "Bored & Hungry",
    area: "SM Aura",
    cuisine: "Western",
    priceRange: "₱280-450",
    dishes: [
      "Smash Burger",
      "Fries",
      "Softdrinks"
    ],
    tags: [
      "comfort",
      "filling",
      "western"
    ],
    attributes: [
      "comfort",
      "filling",
      "western",
      "solo",
      "pair"
    ],
    budgetMax: 600,
    diningTypes: [
      "solo",
      "pair"
    ],
    slug: "bored-hungry-sm-aura-44",
    cuisinePrimary: "Western",
    foodCategories: [
      "Western"
    ],
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Solo"
    ],
    budgetMin: 280,
    priceBucket: "mid"
  },
  {
    id: 45,
    name: "Mango Tree",
    area: "Bonifacio High Street",
    cuisine: "Thai",
    priceRange: "₱450-800",
    dishes: [
      "Pad Thai",
      "Green Curry",
      "Tom Yum"
    ],
    tags: [
      "light",
      "filling",
      "thai"
    ],
    attributes: [
      "light",
      "filling",
      "thai",
      "pair",
      "group"
    ],
    budgetMax: 1000,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "mango-tree-bonifacio-high-street-45",
    cuisinePrimary: "Thai",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Light",
      "Filling"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 450,
    priceBucket: "premium"
  },
  {
    id: 46,
    name: "Prego Trattoria",
    area: "SM Aura",
    cuisine: "SM Aura",
    priceRange: "₱450-850",
    dishes: [
      "Seafood Aglio Olio",
      "Truffle Pizza",
      "Tiramisu"
    ],
    tags: [
      "comfort",
      "filling",
      "italian"
    ],
    attributes: [
      "comfort",
      "filling",
      "italian",
      "sm aura",
      "pair",
      "group"
    ],
    budgetMax: 1000,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "prego-trattoria-sm-aura-46",
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 450,
    priceBucket: "premium"
  },
  {
    id: 47,
    name: "Brotzeit",
    area: "BGC",
    cuisine: "German",
    priceRange: "₱350-650",
    dishes: [
      "Bratwurst Platter",
      "Sauerkraut",
      "Pretzel"
    ],
    tags: [
      "comfort",
      "filling",
      "western"
    ],
    attributes: [
      "comfort",
      "filling",
      "western",
      "german",
      "pair",
      "group"
    ],
    budgetMax: 700,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "brotzeit-bgc-47",
    moodTags: [
      "Comfort",
      "Filling"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 350,
    priceBucket: "mid"
  },
  {
    id: 48,
    name: "Daraejung",
    area: "BGC",
    cuisine: "Korean",
    priceRange: "₱400-700",
    dishes: [
      "Samgyeopsal",
      "Bibimbap",
      "Haemul Pajeon"
    ],
    tags: [
      "filling",
      "comfort",
      "korean"
    ],
    attributes: [
      "filling",
      "comfort",
      "korean",
      "pair",
      "group"
    ],
    budgetMax: 800,
    diningTypes: [
      "pair",
      "group"
    ],
    slug: "daraejung-bgc-48",
    cuisinePrimary: "Korean",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Filling",
      "Comfort"
    ],
    experienceTags: [
      "Group"
    ],
    budgetMin: 400,
    priceBucket: "premium"
  },
  {
    id: 49,
    name: "Keizo",
    area: "BGC",
    cuisine: "Japanese",
    priceRange: "₱450-750",
    dishes: [
      "Omakase",
      "Tempura",
      "Chirashi"
    ],
    tags: [
      "comfort",
      "filling",
      "japanese"
    ],
    budgetMax: 900,
    diningTypes: [
      "pair",
      "group"
    ],
    attributes: [],
    slug: "keizo-bgc-49",
    cuisinePrimary: "Japanese",
    foodCategories: [
      "Asian"
    ],
    moodTags: [
      "Comfort",
      "Filling"
    ],
    budgetMin: 450,
    priceBucket: "premium"
  }
]
