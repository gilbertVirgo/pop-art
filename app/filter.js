require("dotenv").config();

const Jimp = require("jimp");

const maxPxValue = 255 + 255 + 255;

const Filter = {
    toBase64: async frames => {
        for(let i in frames) {
            frames[i] = await frames[i].getBase64Async("image/jpeg");
        }

        return frames;
    },

    popart: async ({buffer, color1, color2}) => {
        color1 = Jimp.cssColorToHex(color1);
        color2 = Jimp.cssColorToHex(color2);

        const image = await Jimp.read(buffer);
        image.resize(+process.env.MAX_WIDTH, Jimp.AUTO);

        const ar = image.bitmap.width / image.bitmap.height;

        const frames = Array(+process.env.FRAMES_LENGTH);

        let delta = +process.env.FRAMES_LENGTH;

        while(delta--) {
            frames[delta] = await new Promise((resolve, reject) => {
                new Jimp(+process.env.MAX_WIDTH, +process.env.MAX_WIDTH / ar, "#000", (error, image) => {
                    if(error) reject(error)
                
                    resolve(image);
                })
            });
        }

        for(let frameIndex in frames) {
            frameIndex = +frameIndex;
            let perc = (frameIndex / frames.length);
            let bkpt = maxPxValue * perc;

            image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, index) {
                let r = this.bitmap.data[index + 0];
                let g = this.bitmap.data[index + 1];
                let b = this.bitmap.data[index + 2];

                let sum = r + g + b;
                let over = sum > bkpt;

                if(over) {
                    frames[frameIndex].setPixelColor(color2, x, y);
                } else {
                    frames[frameIndex].setPixelColor(color1, x, y);
                }
            });
        }

        const b64 = await Filter.toBase64(frames);

        return {frames: b64, width: image.bitmap.width, height: image.bitmap.height};
    }
}

module.exports = Filter;