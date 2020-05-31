const { exec } = require("child_process");

const runFilter = ({ path, color1, color2 }) =>
	new Promise((resolve, reject) => {
		const cmd = exec(
			`java backend.v2.Threshold "${path}" "${color1}" "${color2}"`
		);

		let output = "";

		cmd.stdout.on("data", (data) => (output = data));

		cmd.stderr.on("data", (error) => reject(error));

		cmd.on("close", (code) => {
			console.log("Exited process with code " + code);

			try {
				// Attempt to parse output and return array
				console.log("Process successful");
				resolve(output);
			} catch (error) {
				console.error("Process unsuccessful", error);
				reject(error);
			}
		});
	});

module.exports = { runFilter };
