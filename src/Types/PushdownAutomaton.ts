type Transitions = {
    nextState: string;
    push?: string;
    pop?: string;
    read?: string;
}[]

export type PushdownAutomaton = {
    states: { [key: string]: Transitions };
    alphabet: string[];
    startState: string;
    acceptStates: string[];
    stackAlphabet: string[];
    stack: string[];
}