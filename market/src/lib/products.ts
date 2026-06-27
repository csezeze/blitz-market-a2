export type Category = "Tickets" | "Tech" | "Apparel" | "Festival";

export type Product = {
  id: number;
  name: string;
  category: Category;
  price: number;
  coinId: number;
  mark: string;
  gradient: string;
  description: string;
  stock: number;
  featured?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Manifest Front Stage",
    category: "Tickets",
    price: 420,
    coinId: 2,
    mark: "MNF",
    gradient: "linear-gradient(140deg,#ff5a3c 0%,#ff2e97 55%,#7c3aed 100%)",
    description: "Front-stage access for the Manifest show, unlocked with event coin.",
    stock: 18,
    featured: true,
  },
  {
    id: 2,
    name: "VALORANT Final VIP",
    category: "Tickets",
    price: 380,
    coinId: 3,
    mark: "VLR",
    gradient: "linear-gradient(135deg,#0ea5e9 0%,#7c3aed 60%,#0e0b16 100%)",
    description: "VIP seat and arena lounge access for the finals watch party.",
    stock: 24,
    featured: true,
  },
  {
    id: 3,
    name: "AfterDark 3-Day Combo",
    category: "Festival",
    price: 600,
    coinId: 4,
    mark: "AFD",
    gradient: "linear-gradient(140deg,#ffc93c 0%,#ff5a3c 55%,#ff2e97 100%)",
    description: "Three-day festival pass with fast-lane entry and merch priority.",
    stock: 12,
    featured: true,
  },
  {
    id: 4,
    name: "Monad Dev Laptop 14",
    category: "Tech",
    price: 1500,
    coinId: 0,
    mark: "DEV",
    gradient: "linear-gradient(135deg,#2dd4ff 0%,#7c3aed 60%,#17112a 100%)",
    description: "A lightweight build machine for demo booths and late-night deploys.",
    stock: 3,
  },
  {
    id: 5,
    name: "Wireless Studio Headset",
    category: "Tech",
    price: 300,
    coinId: 0,
    mark: "SND",
    gradient: "linear-gradient(135deg,#c6ff4a 0%,#2dd4ff 62%,#0e0b16 100%)",
    description: "Noise-cut headset for the loud parts of live building.",
    stock: 31,
  },
  {
    id: 6,
    name: "Monad Hoodie",
    category: "Apparel",
    price: 180,
    coinId: 1,
    mark: "ANK",
    gradient: "linear-gradient(135deg,#7c3aed 0%,#ff2e97 70%,#0e0b16 100%)",
    description: "Heavyweight hoodie for builders who stay until the final demo.",
    stock: 44,
  },
  {
    id: 7,
    name: "Festival Tee",
    category: "Apparel",
    price: 90,
    coinId: 4,
    mark: "TEE",
    gradient: "linear-gradient(135deg,#ffc93c 0%,#ff5a3c 100%)",
    description: "Poster-style tee tied to the AfterDark event coin.",
    stock: 68,
  },
  {
    id: 8,
    name: "Blitz Sneaker",
    category: "Apparel",
    price: 250,
    coinId: 0,
    mark: "RUN",
    gradient: "linear-gradient(135deg,#ff2e97 0%,#ffc93c 100%)",
    description: "Limited drop sneaker for the fastest receipt in the room.",
    stock: 9,
  },
];

export const CATEGORIES: Category[] = ["Tickets", "Tech", "Apparel", "Festival"];

export function productById(id: number): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function productsByCategory(category: string): Product[] {
  return PRODUCTS.filter((product) => product.category.toLowerCase() === category.toLowerCase());
}
