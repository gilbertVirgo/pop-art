import React, {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

import {GithubPicker} from "react-color";

import axios from "axios";

const defaults = {
    color1: "#232185", // light 
    color2: "#63ffdd", // dark
    range: "50"
}

const PopArt = ({image, onChange}) => {
    const [color1, setColor1] = useState(defaults.color1);
    const [color2, setColor2] = useState(defaults.color2);
    const [range, setRange] = useState(defaults.range);
    const [frames, setFrames] = useState(null);
    const [frame, setFrame] = useState(null);

    const [loading, setLoading] = useState(false);

    const getIndex = (range, frames) => Math.ceil(range * (frames.length / 100));

    const request = async () => {
        if(color1 && color2) {
            setLoading(true);

            var formData = new FormData();
            formData.append("image", image);
            formData.append("color1", color1);
            formData.append("color2", color2);

            const {data: {frames}} = await axios.post('/filter/popart', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setLoading(false);

            setFrames(frames);

            onChange(frames[getIndex(range, frames)]);
        }
    };

    useEffect(() => {
        (async function() {
            await request()
        })();
    }, [image, color1, color2]);

    useEffect(() => {
        if(frames) setFrame(frames[getIndex(range, frames)]);
    }, [frames, range]);

    useEffect(() => {
        if(frame) onChange(frame);
    }, [frame])

    return (<>
        <Form.Group>
            <Form.Row>
                <Col>
                    <Form.Label>Color 1</Form.Label>
                    {/* <Form.Control 
                        defaultValue={color1}
                        type="color"
                        onBlur={({target: {value}}) => setColor1(value)}/> */}
                    <GithubPicker
                        width={212}
                        color={color1}
                        onChangeComplete={({hex}) => setColor1(hex)}/>
                </Col>
                <Col>
                    <Form.Label>Color 2</Form.Label>
                    {/* <Form.Control 
                        defaultValue={color2}
                        type="color"
                        onBlur={({target: {value}}) => setColor2(value)}/> */}
                    <GithubPicker
                        width={212}
                        color={color2}
                        onChangeComplete={({hex}) => setColor2(hex)}/>
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