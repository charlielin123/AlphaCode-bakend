export declare class CardList implements ICardList {
    name: string;
    id: string;
    cards: ITrelloCard[];
    constructor(name: string, cards: ITrelloCard[]);
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
export declare function uuid(): string;
