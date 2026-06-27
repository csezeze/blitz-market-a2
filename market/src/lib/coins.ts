export type Coin = {
  id: number;
  code: string;
  name: string;
  accent: string;
};

export const COINS: Coin[] = [
  { id: 0, code: "BLITZ", name: "Universal Blitz", accent: "#ff2e97" },
  { id: 1, code: "ANK", name: "Monad Blitz", accent: "#7c3aed" },
  { id: 2, code: "MNF", name: "Manifest", accent: "#ff5a3c" },
  { id: 3, code: "VLR", name: "VALORANT", accent: "#2dd4ff" },
  { id: 4, code: "AFD", name: "AfterDark", accent: "#ffc93c" },
  { id: 5, code: "SND", name: "Sounds of Monad", accent: "#c6ff4a" },
  { id: 6, code: "BLD", name: "Builders Meetup", accent: "#f7f3ea" },
];

export const COIN_IDS = COINS.map((coin) => coin.id);

export function coinById(id: number): Coin {
  return COINS.find((coin) => coin.id === id) ?? COINS[0];
}
