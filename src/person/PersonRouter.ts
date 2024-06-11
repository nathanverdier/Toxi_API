import axios from 'axios';
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
    .post(checkJwt, async (req, res) => {
        try {
            const newPerson = req.body;
            const addedPerson = await personService.addSomeone(newPerson);

            // Notify the other project
            const AIRecognition = 'https://codefirst.iut.uca.fr/containers/ToxiTeam-toxi-iarecognition/add_person';
            try {
                await axios.post(AIRecognition, addedPerson);
                console.log('The person has been successfully transmitted to AIRecognition.');
            } catch (error) {
                console.error('The external AI is not accessible:', error);
            }

            res.json(addedPerson);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Une erreur est survenue lors de l\'ajout de la personne.' });
        }
    });

export default PersonRouter;