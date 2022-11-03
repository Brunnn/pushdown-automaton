import { ParsingResult } from "./Types/ParsingResult";
import { PushdownAutomaton } from "./Types/PushdownAutomaton";

// M = { 0n 1n | n > 0 }
var automaton: PushdownAutomaton = {
  alphabet: ["0", "1"],
  startState: "q0",
  acceptStates: ["q2"],
  stackAlphabet: ["0", "1", "$"],
  stack: ["$"],
  states: {
    q0: [
      {
        nextState: "q0",
        push: "0",
        read: "0",
      },
      {
        nextState: "q1",
        pop: "0",
        read: "1",
      },
    ],

    q1: [
      {
        nextState: "q1",
        pop: "0",
        read: "1",
      },
      {
        nextState: "q2",
        pop: "$",
      },
    ],
    q2: [],
  },
};

function parseInput(
  input: string,
  automaton: PushdownAutomaton
): ParsingResult {
  var parsingResult: ParsingResult = {
    accepted: false,
    word: input.toLowerCase().trim(),
    stack: automaton.stack,
    state: automaton.startState,
    errorMessage: "",
  };

  var currentState = automaton.startState;
  var currentStack = automaton.stack;

  // Loop through each character in the input
  for (let char of parsingResult.word) {
	
	
    // Check if the current character is in the alphabet
    if (!automaton.alphabet.includes(char)) {
      parsingResult.errorMessage = `Character '${char}' is not in the alphabet`;
      return parsingResult;
    }

    var currStateTransitions = automaton.states[currentState];

    // Check if in the automaton definition there is a state with the current ID
    if (currStateTransitions === undefined) {
      parsingResult.errorMessage = `State '${currentState}' is not defined, please check your automaton definition`;
      return parsingResult;
    }
    // Checks if the current state has a transitions defined
    if (currStateTransitions.length === 0) {
      parsingResult.errorMessage = `No transitions defined from state '${currentState}'`;
      return parsingResult;
    }

    //Tries to find the transition that matches the current input
    var transition = currStateTransitions.find((t) => t.read === char);
    if (transition === undefined) {
      parsingResult.errorMessage = `No transition defined from state '${currentState}' with input '${char}'`;
      return parsingResult;
    }

    // If the transition has a pop defined, pop the stack and check if the popped element is the same as the one defined in the transition
    if (transition.pop !== undefined) {
      var popped = currentStack.pop();
      if (popped !== transition.pop) {
        parsingResult.errorMessage = `Popped '${popped}' from the stack, but expected '${transition.pop}'`;
        return parsingResult;
      }
    }

    // If the transition has a push defined, push the element to the stack
    if (transition.push !== undefined) {
      currentStack.push(transition.push);
    }

    // Set the current state to the next state defined in the transition
    currentState = transition.nextState;
  }



  // Make an epson transition to the accept state
  var currStateTransitions = automaton.states[currentState];
  var transition = currStateTransitions.find((t) => t.read === undefined);
  
  if (transition === undefined) {
    parsingResult.errorMessage = `No epson transition defined from state '${currentState}', trying to reach accept state`;
    return parsingResult;
  }

  // If the transition has a pop defined, pop the stack and check if the popped element is the same as the one defined in the transition
  if (transition.pop !== undefined) {
    var popped = currentStack.pop();
    if (popped !== transition.pop) {
      parsingResult.errorMessage = `Popped '${popped}' from the stack, but expected '${transition.pop}'`;
    }
  }

  currentState = transition.nextState;

  //If there are still elements in the stack, the input is not accepted
  if (currentStack.length > 0) {
	parsingResult.errorMessage = `Stack is not empty, the input is not accepted`;
	return parsingResult;
  }

  if (automaton.acceptStates.includes(currentState)) {
	parsingResult.accepted = true;
	parsingResult.stack = currentStack;
	parsingResult.state = currentState;
  }
  


  return parsingResult;
}



var input = "00000111";
var result = parseInput(input, automaton);
console.log(result);
