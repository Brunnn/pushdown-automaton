export type ParsingResult = {
    accepted: boolean;
    word: string;
    stack: string[];
    state: string;
    errorMessage: string;
}