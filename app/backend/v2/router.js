require("dotenv").config()

const express = require("express")
const { exec } = require("child_process")
const fs = require("fs-extra")
const path = require("path")

const getFolderSize = require("get-folder-size")

const router = express.Router()

const regulateFolderSize = () => {
  const tmp = `${__dirname}/../../tmp`
  const maxSize = +process.env.MAX_FOLDER_SIZE * 1024 * 1024

  // Get files (and folders)
  const files = fs.readdirSync(tmp)

  // Sort files by date
  const sorted = files.sort((a, b) => {
    ;[a, b].map((folder) => fs.statSync(path.join(tmp, folder)).birthtimeMs)
    return b - a
  })

  ;(async function tick() {
    const tmpSize = await new Promise((resolve, reject) =>
      getFolderSize(tmp, (error, size) =>
        error ? reject(error) : resolve(size)
      )
    )

    if (tmpSize > maxSize) {
      const oldest = path.join(tmp, sorted.shift())

      console.log(
        "Maximum directory size reached. Removing file ",
        oldest.split("/").slice(-2).join("/")
      )

      try {
        await fs.remove(oldest)
      } catch (error) {
        console.error(error.toString())
      }

      tick()
    }
  })()
}

const runFilter = ({ path, color1, color2 }) =>
  new Promise((resolve, reject) => {
    const cmd = exec(
      `java backend.v2.Threshold "${path}" "${color1}" "${color2}"`
    )

    let output = ""

    cmd.stdout.on("data", (data) => (output = data))

    cmd.stderr.on("data", (error) => reject(error))

    cmd.on("close", (code) => {
      console.log("Exited process with code " + code)

      try {
        // Attempt to parse output and return array
        console.log("Process successful")
        resolve(output)
      } catch (error) {
        console.error("Process unsuccessful", error)
        reject(error)
      }
    })
  })

router.post(
  "/popart",
  async ({ files: { image }, body: { color1, color2 } }, res) => {
    try {
      const path = `${__dirname}/../../${image.tempFilePath}`

      // Root folder
      const id = await runFilter({ path, color1, color2 })

      res.json({ success: true, id, length: process.env.FRAMES_LENGTH })

      regulateFolderSize()
    } catch (error) {
      console.error(error.toString())
      res.json({ success: false, error })
    }
  }
)

module.exports = router
