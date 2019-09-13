const express = require("express");
const Filter = require("./filter");

const router = express.Router();

router.post("/popart", async ({files: {image}, body: {color1, color2}}, res) => {
    try {
        const data = await Filter.popart({
            buffer: image.data,
            color1, color2
        });

        res.json({success: true, ...data});
    } catch(error) {
        console.error(error);
        res.json({success: false, error});
    }
});

module.exports = router;