import React, {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

import {CompactPicker} from "react-color";

import axios from "axios";

const defaults = {
    highlights: "#eeffdd", // light 
    shadows: "#11331e", // dark
    range: "50"
}

const PopArt = ({context, image, onChange}) => {
    const [highlights, setHighlights] = useState(defaults.highlights);
    const [shadows, setShadows] = useState(defaults.shadows);
    const [range, setRange] = useState(defaults.range);
    const [frames, setFrames] = useState(null);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const getIndex = (range, frames) => Math.ceil(range * (frames.length / 100));

    const renderFrame = frame => {
        const {canvas} = context;
        const ar = frame.width / frame.height;

        canvas.height = canvas.width / ar;

        context.save();
        context.drawImage(frame, 0, 0, canvas.width, canvas.height);

        // set composite mode
        context.globalCompositeOperation = "source-in";

        // draw color
        context.fillStyle = shadows;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.globalCompositeOperation = "destination-over";

        context.fillStyle = highlights;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();

        // For later download
        onChange(canvas.toDataURL("image/png"));
    }

    const request = async () => {
        setLoading(true);

        var formData = new FormData();
        formData.append("image", image);

        let {data: {id, length, success, error}} = await axios.post('/api/v2/filter/popart', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const images = Array(+length).fill().map((_, index) => {
            return new Promise(resolve => {
                let image = new Image();
                image.onload = () => resolve(image);
                image.src = `/images/${id}/${index}.png`;
            });
        });

        if(success) {
            // Await image load
            let frames = await Promise.all(images);

            console.log({frames});

            setLoading(false);

            setFrames(frames);
        } else {
            setError(error);
        }
    };

    useEffect(() => {
        (async function() {
            await request()
        })();
    }, [image]);

    useEffect(() => {
        if(frames) {
            const frame = frames[getIndex(range, frames)];
            renderFrame(frame);
        }
    }, [frames, range, highlights, shadows]);

    return (<>
        {error && <p className="text-danger" style={{textAlign: "center"}}>{error}</p>}
        <Form.Group>
            <Form.Row>
                <Col>
                    <Form.Label>Highlights</Form.Label>
                    {/* <Form.Control 
                        defaultValue={highlights}
                        type="color"
                        onBlur={({target: {value}}) => setHighlights(value)}/> */}
                    <CompactPicker
                        width={212}
                        color={highlights}
                        onChangeComplete={({hex}) => setHighlights(hex)}/>
                </Col>
                <Col>
                    <Form.Label>Shadows</Form.Label>
                    {/* <Form.Control 
                        defaultValue={shadows}
                        type="color"
                        onBlur={({target: {value}}) => setShadows(value)}/> */}
                    <CompactPicker
                        width={212}
                        color={shadows}
                        onChangeComplete={({hex}) => setShadows(hex)}/>
                </Col>
            </Form.Row>
        </Form.Group>
        <Form.Group>
            <Form.Control 
                value={range}
                type="range"
                className="custom-range"
                onChange={({target: {value}}) => setRange(+value)}/>
        </Form.Group>
        <Modal show={loading}>
            <Modal.Body style={{textAlign: "center"}}>
                <h5>Loading filter...</h5>
                <Spinner variant="primary" animation="grow" />
            </Modal.Body>
        </Modal>
    </>)
}

export default PopArt;