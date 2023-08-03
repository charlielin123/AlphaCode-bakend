export class CardList implements ICardList {
  name: string = "";
  id: string;
  cards: ITrelloCard[] = [];
  constructor(name: string, cards: ITrelloCard[]) {
    this.name = name;
    this.id = uuid();
    this.cards = cards;
  }
}
export interface ICardList {
  name: string;
  id: string;
  cards: ITrelloCard[];
}
export interface ITrelloCard {
  card: {
    id: string;
    name: string;
    idShort?: number;
    shortLink?: string;
  };
}
export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
