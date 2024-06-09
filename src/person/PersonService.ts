import PersonModel from "./PersonModel";
import Person from "./PersonSchema";

export const personService = {
    getAll: async () => await Person.find(),
    addSomeone: async (newPerson: PersonModel) => {
        const person = new Person(newPerson);
        return await person.save();
    },
};