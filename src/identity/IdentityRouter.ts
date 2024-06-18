import express from "express";
import { initializeCheckJwt } from "../app";
import axios from "axios";
import boom from "@hapi/boom";
import fs from "fs";
import path from "path";

const checkJwt = initializeCheckJwt();

const IdentityRouter = express.Router();

IdentityRouter.route('/')
    .post(checkJwt,
        express.raw({ type: 'image/jpeg', limit: '10mb' }),
        async (req, res) => {
            try {
                // Check if binary data is present
                if (!req.body || !Buffer.isBuffer(req.body)) {
                    boom.badRequest('No image passed');
                    return;
                }

                // Save the binary data temporarily to a file
                const tempFilePath = path.join(__dirname, 'temp_image.jpg');
                fs.writeFileSync(tempFilePath, req.body);

                // Read the file data
                const imageData = fs.createReadStream(tempFilePath);

                // Make HTTP call to AI URL
                const aiUrl = process.env.AI_URL as string;
                const response = await axios.post(`${aiUrl}/detect_faces`, imageData, {
                    headers: {
                        'Content-Type': 'image/jpeg',
                    },
                    maxBodyLength: Infinity,
                });

                const responseData = response.data;

                // Clean up temporary file
                fs.unlinkSync(tempFilePath);

                if (response.status !== 200) {
                    console.log("Bad response status: ", response.status);
                    boom.badRequest('Bad response from AI', response.statusText);
                    return;
                }

                console.log("API response", responseData);
                res.json(responseData);

            } catch (error) {
                console.log("Unexpected error:", error);
                boom.internal('Unexpected error occurred'); 
                return;
            }
        });

export default IdentityRouter;
