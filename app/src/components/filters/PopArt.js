import React, {useEffect, useState} from "react";
import Render from "./Render";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import LoadingModal from "../LoadingModal";

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
    const [composite, setComposite] = useState(false);

    // frames.length - 1 to prevent out of bounds error
    const getIndex = (range, frames) => Math.floor(range * ((frames.length - 1) / 100));

    const request = async () => {
        setLoading(true);

        var formData = new FormData();
        formData.append("image", image);

        let {data: {id, length, success, error}} = await axios.post('/api/v2/filter/popart', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const images = Array(+length + 1).fill().map((_, index) => {
            return new Promise(resolve => {
                let image = new Image();
                image.onload = () => resolve(image);
                image.src = `/images/${id}/${index}.png`;
            });
        });

        images.push()

        if(success) {
            // Await image load
            let frames = await Promise.all(images),
                {canvas} = context;

            canvas.width = frames[0].width;
            canvas.height = frames[0].height;

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
            let frame;

            if(!composite) frame = frames[getIndex(range, frames)];
            else frame = frames[20];

            onChange(Render.Frame({context, frame, highlights, shadows}));
        }
    }, [frames, range, highlights, shadows, composite]);

    return (<>
        {error && <p className="text-danger" style={{textAlign: "center"}}>{error}</p>}
        <Form.Group>
            <Form.Row>
                <Col>
                    <Form.Label>Highlights</Form.Label>
                    <Form.Control 
                        defaultValue={highlights}
                        type="color"
                        className="custom-color-input"
                        onChange={({target: {value}}) => setHighlights(value)}/>
                </Col>
                <Col>
                    <Form.Label>Shadows</Form.Label>
                    <Form.Control 
                        defaultValue={shadows}
                        type="color"
                        className="custom-color-input"
                        onChange={({target: {value}}) => setShadows(value)}/>
                </Col>
            </Form.Row>
        </Form.Group>

        <Form.Group>
            <div className="custom-control custom-switch">
                <input 
                    checked={composite} 
                    onChange={({target: {checked}}) => setComposite(checked)} 
                    type="checkbox" 
                    className="custom-control-input" 
                    id="compositeSwitch"/>
                <label className="custom-control-label" htmlFor="compositeSwitch">Show composite</label>
                <p className="text-muted small" style={{marginTop: "10px"}}>This will combine all the different frames into one composite image.</p>
            </div>
        </Form.Group>

        {!composite && (
            <Form.Group>
                <Form.Control 
                    value={range}
                    type="range"
                    className="custom-range"
                    onChange={({target: {value}}) => setRange(+value)}/>
            </Form.Group>
        )}

        <LoadingModal show={loading} message="Running filter"/>
    </>)
}

export default PopArt;