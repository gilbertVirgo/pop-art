import React, {useState} from "react";

// import loadImage from "../load-image";
// import "../load-image-exif";

// import "../load-image-orientation";
import loadImage from "../loadimage/index.js"
import Form from "react-bootstrap/Form";

const ImageSelect = ({onChange}) => {
    const [name, setName] = useState(null);

    const [src, setSrc] = useState("");
    const [canvas, setCanvas] = useState(null);

    const adjustImage = (image, orientation, cb) => { 
        console.log({image, orientation, cb});

        //image.width = 500;

        const rotationalCorrection = [0, 0, Math.PI, Math.PI, Math.PI * 1.5, Math.PI * 1.5, Math.PI / 2, Math.PI / 2];

        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        context.translate(image.width / 2, image.height / 2);
        context.rotate(rotationalCorrection[orientation]);
        context.drawImage(image, image.width / -2, image.height / -2, image.width, image.height);
        
        const img = new Image();
        img.addEventListener("load", function() {
            cb(this);
        })
        img.src = canvas.toDataURL();
    }

    const handleChange = async ({target: {files: [file]}}) => {
        setName(file.name);

        if(typeof onChange === "function") {
            loadImage(
                file,
                (image, data) => {
                    const orientation = data.exif ? data.exif[274] : 1;
                    console.log(data);

                    adjustImage(image, orientation, img => onChange(img));
                },
                {meta: true, maxWidth: 500}
            );
        }
    }

    return (<>
        <div className="custom-file">
            <Form.Control
                accept="image/*"
                type="file"
                className="custom-file-input"
                onChange={handleChange}
                />
            {canvas}
            <Form.Label className="custom-file-label">{name || "Choose image"}</Form.Label>
        </div>
    </>)
}

export default ImageSelect;