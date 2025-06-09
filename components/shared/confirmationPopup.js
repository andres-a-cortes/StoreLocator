import React from 'react'
import { Modal } from 'react-bootstrap'

const ConfirmationPopup = (props) => {
    const { isOpen, toggle, obj } = props

    return (
        <Modal show={isOpen} onHide={toggle}>
            <Modal.Header closeButton>
                <Modal.Title>{obj.headerText}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className='mb-0'>{obj.text}</p>
            </Modal.Body>
            <Modal.Footer>
                <div className='d-flex'>
                    <button className='btn btn-secondary me-2' onClick={toggle}>Cancel</button>
                    <button className='btn btn-danger' onClick={() => { obj.action(); toggle() }}>Delete</button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ConfirmationPopup
