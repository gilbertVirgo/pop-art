require("dotenv").config();

const express = require("express");
const {exec} = require('child_process');

const router = express.Router();

const runFilter = ({path}) => new Promise((resolve, reject) => {
    const cmd = exec(`java backend.v2.ThresholdMap "${path}"`);

    let output = "";

    cmd.stdout.on("data", data => output = data);

    cmd.stderr.on("data", error => reject(error));

    cmd.on("close", (code) => {
        console.log("Exited process with code " + code);

        try {
            // Attempt to parse output and return array
            console.log("Process successful");
            resolve(output);
        } catch(error) {
            console.error("Process unsuccessful", error);
            reject(error);
        }
    });
});

router.post("/popart", async ({files: {image}}, res) => {
    try {
        const path = `${__dirname}/../../${image.tempFilePath}`;

        // Root folder
        const startTime = Date.now();
        const id = await runFilter({path});
        console.log("Finished task. Completed in " + ((Date.now() - startTime) / 1000) + " seconds.");

        res.json({success: true, id, length: process.env.FRAMES_LENGTH});
    } catch(error) {
        console.error(error.toString());
        res.json({success: false, error});
    }
});

module.exports = router;