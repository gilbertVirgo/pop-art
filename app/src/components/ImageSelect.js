import React, {useState} from "react";

import Form from "react-bootstrap/Form";

const ImageSelect = ({onChange}) => {
    const [name, setName] = useState(null);

    const toImageData = file => {   
        window.URL = window.URL || window.webkitURL;
        
        URL.createObjectURL(file);         
        const image = new Image();
        
        return new Promise(resolve => {
            image.addEventListener("load", function() {                    
                URL.revokeObjectURL(this.src);
                resolve(this);
            });
        });
    }

    const handleChange = async ({target: {files: [file]}}) => {
        setName(file.name);

        if(typeof onChange === "function") {
            onChange(await toImageData(file));
        }
    }

    return (
        <div className="custom-file">
            <Form.Control
                accept="image/*"
                type="file"
                className="custom-file-input"
                onChange={handleChange}
                />
            <Form.Label className="custom-file-label">{name || "Choose image"}</Form.Label>
        </div>
    )
}

export default ImageSelect;