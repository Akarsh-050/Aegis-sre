import { Annotation } from "@langchain/langgraph";

export const AgentState = Annotation.Root({

    error: Annotation<string>(),
    
    fileContent: Annotation<string>(),

    targetFile: Annotation<string>(),

    attempts: Annotation<number>(),

    isFixed: Annotation<boolean>(),

});



// import { Annotation } from "@langchain/langgraph";

// export const AgentState = Annotation.Root({
//   error: Annotation<string>({
//     default: () => "",
//   }),

//   targetFile: Annotation<string>({
//     default: () => "",
//   }),

//   fileContent: Annotation<string>({
//     default: () => "",
//   }),

//   attempts: Annotation<number>({
//     default: () => 0,
//     reducer: (current, update) => current + update,
//   }),

//   isFixed: Annotation<boolean>({
//     default: () => false,
//   }),
// });
