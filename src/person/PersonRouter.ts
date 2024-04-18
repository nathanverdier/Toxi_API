import express from "express";
import { initializeCheckJwt } from "../app";
import { personService } from "./PersonService";

const checkJwt = initializeCheckJwt();

const PersonRouter = express.Router();

PersonRouter.route('/')
    .get(checkJwt, async (_, res) => {
        try {
            const persons = await personService.getAll();
            console.log(persons);
            res.json(persons);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des personnes.' });
        }
    })
    .post(checkJwt, (_, res) => {
        res.json("coucou post");
    });

export default PersonRouter;