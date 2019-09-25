require("dotenv").config();

const express = require("express");
const fs = require("fs");
const {spawn, exec} = require('child_process');
const randomstring = require("randomstring");

const router = express.Router();

const runFilter = ({path, color1, color2}) => new Promise((resolve, reject) => {
    const cmd = exec(`java backend.v2.Threshold "${path}" "${color1}" "${color2}"`);

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

router.post("/popart", async ({files: {image}, body: {color1, color2}}, res) => {
    try {
        const path = `${__dirname}/../../${image.tempFilePath}`;

        // Root folder
        const id = await runFilter({path, color1, color2});

        res.json({success: true, id, length: process.env.FRAMES_LENGTH});
    } catch(error) {
        console.error(error.toString());
        res.json({success: false, error});
    }
});

module.exports = router;