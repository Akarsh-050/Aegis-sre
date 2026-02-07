// 1. Define a "Type" for our Project
interface Project {
    name: string;
    version: number;
    isHealing: boolean;
}

// 2. Create an object using that type
const aegis: Project = {
    name: "Aegis-SRE",
    version: 0.1,
    isHealing: true
};

// 3. Print it out
console.log(`Initializing ${aegis.name} v${aegis.version}... Status: Active.`);