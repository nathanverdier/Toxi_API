import express from "express";
import formidable from "formidable";
import { initializeCheckJwt } from "../app";
import axios from "axios";

const checkJwt = initializeCheckJwt();

const IdentityRouter = express.Router();

IdentityRouter.route('/')
    .post(checkJwt,
        async (req, res, next) => {
            try {
                // Initialize formidable form parser
                const form = formidable({});

                // Parse form data (only need to retrieve files)
                form.parse(req, async (err, _, files) => {
                    if (err) {
                        console.log("aaaaah", err);
                    }

                    // Check if file upload was successful
                    if (!files || !files.image) {
                        console.log("bbbbbbbb", err);
                    }

                    // Retrieve file data
                    const imageData = files.image;

                    // Process the image data
                    console.log("Image received:", imageData);

                    // Make HTTP call to AI URL
                    const aiUrl = process.env.AI_URL as string;
                    const response = await axios.get(aiUrl);

                    if (response.status !== 200) {
                        console.log("error");
                    }

                    const responseData = response.data;

                    res.json({ message: 'Yepeeee' });
                });
            } catch (error) {
                console.error(error);
                next(error); // Pass the error to the Express error handling middleware
            }
        });

export default IdentityRouter;