import { AgentState } from "./src/graph/state.js";

const initialState = {
    error: "ReferenceError: x is not defined",
    attempts: 0,
    isFixed: false,
    targetFile: "server.js",
    fileContent: ""
};

console.log("Brain Memory Initialized:", initialState);