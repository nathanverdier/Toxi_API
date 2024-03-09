import Person from "./PersonSchema";

export const personService = {
    getAll: async () => await Person.find(),
};