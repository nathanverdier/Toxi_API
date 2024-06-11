import express from "express";
import formidable from "formidable";
import { initializeCheckJwt } from "../app";
import axios from "axios";
import boom from "@hapi/boom";

const checkJwt = initializeCheckJwt();

const IdentityRouter = express.Router();

IdentityRouter.route('/')
    .post(checkJwt,
        async (req, res) => {
            try {
                // Initialize formidable form parser
                const form = formidable({});

                // Parse form data (only need to retrieve files)
                form.parse(req, async (err, _, files) => {
                    if (err) {
                        console.error(err.stack);
                        res.status(400).send('Error during data parsing');
                    }

                    // Check if file upload was successful
                    if (!files || !files.image) {
                        console.error(err.stack);
                        boom.badRequest('Error no file found');
                    }

                    // Retrieve file data
                    const imageData = files.image;


                    // Make HTTP call to AI URL
                    const aiUrl = process.env.AI_URL as string;
                    const response = await axios.get(aiUrl);

                    if (response.status !== 200) {
                        console.log("error");
                    }

                    const responseData = {
                        "face_locations": [
                            {
                                x1: 12,
                                x2: 24,
                                y1: 24,
                                y2: 12,
                            } as Location,
                        ],
                        "face_names": [
                            "Lucie"
                        ]
                    };

                    if (response.status !== 200) {
                        console.error("Bad response status: ", response.status);
                        boom.badRequest('Bad response from AI');
                    }

                    res.json({ data : responseData });
                });
            } catch (error) {

                console.error("Unexpected error:", error);
                boom.internal('Unexpected error occurred'); 
                
            }
        });

export default IdentityRouter;