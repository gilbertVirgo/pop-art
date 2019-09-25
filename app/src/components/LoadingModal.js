import React from "react";

import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

const LoadingModal = ({show, message = "Loading..."}) => (
    <Modal show={show}>
        <Modal.Body style={{textAlign: "center"}}>
            <h5>{message}</h5>
            <Spinner variant="primary" animation="grow" />
        </Modal.Body>
    </Modal>
)

export default LoadingModal;