'use client'
import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

function EditData(props) {
    const { isOpen, toggle, obj } = props
    const [data, setData] = useState({})
    const [error, setError] = useState('')

    useEffect(() => {
        if(obj.data) {
            setData(obj.data)
        }
    }, [obj.data])

    const handleInput = (event) => {
        let name = event.target.name
        let value = event.target.value
        setData({ ...data, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = sessionStorage.getItem('token');
        const userid = sessionStorage.getItem('userid');
        let dataObj = { token, userid, body: data, id: data.id }
        let response = await obj.action(dataObj)
        obj.update(data)
        toggle()
    }

    return (
        <Modal isOpen={isOpen} size={'md'}>
            <form onSubmit={handleSubmit}>
                <ModalHeader toggle={toggle}>{obj.text}</ModalHeader>
                <ModalBody>
                    {obj?.inputs?.map((item, i) => {
                        return (
                            <div key={'input_' + i} className='d-flex flex-column'>
                                <label>{item.label}</label>
                                <input className='form-control' type={item.type} name={item.key} value={data[item.key] ||''} required={item.required} onChange={handleInput} />
                            </div>
                        )
                    })}
                </ModalBody>
                <ModalFooter>
                    <div className='d-flex align-items-center'>
                        {error && <p className='text-danger mb-0 me-2'>{error}</p>}
                        <button className='btn btn-secondary' onClick={toggle}>Close</button>
                        <button className='btn btn-primary ms-2' type={'submit'}>{obj.text}</button>
                    </div>
                </ModalFooter>
            </form>
        </Modal>
    )
}

export default EditData