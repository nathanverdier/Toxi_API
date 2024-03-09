import PersonModel from "./PersonModel";
import { model, Schema } from "mongoose";

const PersonSchema = new Schema<PersonModel>(
    {
        _id: { type: String, required: true },
        image: { type: String, required: false },
        name: { type: String, required: true },
    },
);

const Person = model<PersonModel>("people", PersonSchema);

export default Person;