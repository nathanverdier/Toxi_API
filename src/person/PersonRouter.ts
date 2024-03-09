import express from "express";
import { personService } from "./PersonService";

const PersonRouter = express.Router();

PersonRouter.route('/')
    .get(async (_, res) => {
        const persons = await personService.getAll();
        console.log(persons);
        res.json(persons);
    })
    .post((_, res) => {
        res.json("coucou post");
    });

export default PersonRouter;

