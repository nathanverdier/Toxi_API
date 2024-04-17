import express from "express";
import { personService } from "./PersonService";
import checkJwt from "../app"; // importez le middleware d'authentification

const PersonRouter = express.Router();

PersonRouter.route('/')
    .get(checkJwt, async (_, res) => { // utilisez le middleware d'authentification
        try {
            const persons = await personService.getAll();
            console.log(persons);
            res.json(persons);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des personnes.' });
        }
    })
    .post(checkJwt, (_, res) => { // utilisez le middleware d'authentification
        res.json("coucou post");
    });

export default PersonRouter;