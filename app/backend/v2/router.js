require("dotenv").config();

const { runFilter } = require("./functions");

const express = require("express");
const router = express.Router();

const { promises: fs } = require("fs");
const path = require("path");

router.post(
	"/popart",
	async ({ files: { image }, body: { color1, color2 } }, res) => {
		try {
			const path = `${__dirname}/../../${image.tempFilePath}`;

			// Root folder
			const id = await runFilter({ path, color1, color2 });

			res.json({ success: true, id, length: process.env.FRAMES_LENGTH });

			// Remove files now we're done
			try {
				const tmpPath = path.join(__dirname, "..", "..", "tmp");

				await fs.rmdir(tmpPath, { recursive: true });
				await fs.mkdir(tmpPath);
			} catch (error) {
				console.log(error.toString());
				// Don't resend headers on error
			}
		} catch (error) {
			console.error(error.toString());
			res.json({ success: false, error });
		}
	}
);

module.exports = router;
