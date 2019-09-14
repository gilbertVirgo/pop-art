import React, {useState} from "react";

import imageCompression from "browser-image-compression";

import Form from "react-bootstrap/Form";

const ImageSelect = ({onChange}) => {
    const [name, setName] = useState(null);

    const handleChange = async ({target: {files: [file]}}) => {
        setName(file.name);

        const image = await imageCompression(file, {maxSizeMB: 0.5});

        if(typeof onChange === "function") onChange(image)
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