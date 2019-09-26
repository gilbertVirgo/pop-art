import React, {useState} from "react";

import imageCompression from "browser-image-compression";

import Form from "react-bootstrap/Form";
import LoadingModal from "./LoadingModal";

import "../functions";

const ImageSelect = ({onChange}) => {
    const [name, setName] = useState(null);
    const [compress, setCompress] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleChange = async ({target: {files: [file]}}) => {
        setName(file.name);
        setLoading(true);

        const {width, height} = await file.getDimensions();

        // Make sure that profile orientated photos don't get over-compressed
        const ar = width / height;
        const maxWidth = compress ? 500 : 1000;

        const maxWidthOrHeight = (width >= height) ? maxWidth : maxWidth / ar;
        const maxSizeMB = compress ? 0.15 : 0.5;

        const image = await imageCompression(file, {maxWidthOrHeight, maxSizeMB});

        setLoading(false);

        if(typeof onChange === "function") onChange(image);
    }

    return (<>
        <Form.Group>
            <div className="custom-control custom-switch">
                <input 
                    checked={compress} 
                    onChange={({target: {checked}}) => setCompress(checked)} 
                    type="checkbox" 
                    className="custom-control-input" 
                    id="compressSwitch"/>
                <label className="custom-control-label" htmlFor="compressSwitch">Use heavier compression</label>
                <p className="text-muted small" style={{marginTop: "10px"}}>Heavier compression will make the process faster, but significantly reduce the quality of the resulting image</p>
            </div>
        </Form.Group>
        <Form.Group className="custom-file">
            <Form.Control
                accept="image/*"
                type="file"
                className="custom-file-input"
                onChange={handleChange}
                />
            <Form.Label className="custom-file-label">{name || "Choose image"}</Form.Label>
        </Form.Group>
        <LoadingModal show={loading} message="Compressing image"/>
    </>);
}

export default ImageSelect;