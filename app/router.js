const express = require("express");
const Filter = require("./filter");
const fs = require("fs");
const date = require("date-and-time");

const router = express.Router();

router.post("/popart", async ({files: {image}, body: {color1, color2}}, res) => {
    try {
        const data = await Filter.popart({
            buffer: image.data,
            color1, color2
        });

        await fs.promises.appendFile(
            "./log.txt", 
            `New image created at ${date.format(new Date(), 'DD/MM/YYYY HH:mm:ss')}\n`,
            {encoding: "utf-8"});

        res.json({success: true, ...data});
    } catch(error) {
        console.error(error);
        res.json({success: false, error});
    }
});

module.exports = router;