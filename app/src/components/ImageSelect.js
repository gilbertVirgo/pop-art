import React, {useState} from "react";

import imageCompression from "browser-image-compression";

import Form from "react-bootstrap/Form";
import LoadingModal from "./LoadingModal";

const ImageSelect = ({onChange}) => {
    const [name, setName] = useState(null);
    const [compress, setCompress] = useState(true);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = async ({target: {files: [file]}}) => {
        setName(file.name);

        let image;

        if(compress) {
            setMessage("Compressing image");
            setLoading(true);

            const {width, height} = await new Promise(resolve => {
                const tempImage = new Image();

                tempImage.src = window.URL.createObjectURL(file);

                tempImage.onload = () => {
                    let {naturalWidth: width, naturalHeight: height} = tempImage;

                    window.URL.revokeObjectURL(tempImage.src);

                    resolve({width, height});
                }  
            })

            const ar = width / height;

            // Make sure that profile orientated photos don't get over-compressed
            const maxWidthOrHeight = (ar < 1) ? 500 : 500 / ar;

            image = await imageCompression(file, {maxWidthOrHeight, maxSizeMB: 1.5});
            setLoading(false);
        } else {
            setMessage("Checking image");
            setLoading(true);
            image = await imageCompression(file, {maxSizeMB: 1.5});
            setLoading(false);
        }

        if(typeof onChange === "function") onChange(image);
    }

    return (<>
        <Form.Group>
            <Form.Check checked={compress} onChange={({target: {checked}}) => setCompress(checked)} label="Compress before upload"/>
            <p className="text-muted small" style={{marginTop: "10px"}}>Compression will make the process faster, but significantly reduce the quality of the resulting image</p>
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
        <LoadingModal show={loading} message={message || "Compressing image"}/>
    </>);
}

export default ImageSelect;