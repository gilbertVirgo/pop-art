import React, {useState} from "react";

// import loadImage from "../load-image";
// import "../load-image-exif";

// import "../load-image-orientation";
import loadImage from "../loadimage/index.js"
import Form from "react-bootstrap/Form";

const ImageSelect = ({onChange}) => {
    const [name, setName] = useState(null);

    const handleChange = async ({target: {files: [file]}}) => {
        setName(file.name);

        if(typeof onChange === "function") onChange(file)
    }

    return (<>
        <div className="custom-file">
            <Form.Control
                accept="image/*"
                type="file"
                className="custom-file-input"
                onChange={handleChange}
                />
            <Form.Label className="custom-file-label">{name || "Choose image"}</Form.Label>
        </div>
    </>)
}

export default ImageSelect;