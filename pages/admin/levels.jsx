import Layout from '@/components/shared/layout'
import TableDataComp from '@/components/tableData/tableData'
import React, { useState, useEffect } from 'react'
import { faPenAlt, faStore, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { editLevel , deleteData, addLevel, getLevels } from '@/functions/globalFunctions'
import EditData from '@/components/editData'
import ConfirmationPopup from '@/components/shared/confirmationPopup'

function Levels() {

    const [data, setData] = useState([])
    const [editModal, setEditModal] = useState(false)
    const [popup, setPopup] = useState(false)
    const [detailObj, setDetailObj] = useState({})
    const [ids, setIds] = useState([])
    const [loading, setLoading] = useState(true)
    const [checkAll, setCheckAll] = useState(false)

    const thead = [
        {
            name: () => <span><input type={'checkbox'} className='form-check-input' onChange={(event) => handleCheckAll(event)}  checked={checkAll} /></span>,
            selector: ['id'],
            cell: (prop, data) => <span><input type={'checkbox'} className='form-check-input' onChange={(event) => handleCheck(event, prop)} checked={ids.includes(data.id)} /></span>
        },
        {
            name: () => 'Name',
            selector: ['name'],
            cell: (name) => <span>{name}</span>
        },
        {
            name: () => 'Order',
            selector: ['order'],
            cell: props => <span>{props}</span>
        },
        {
            name: () => 'Created At',
            selector: ['created_at'],
        },
        {
            name: () => 'Actions',
            selector: ['id'],
            cell: (prop, data) => {
                return (<div>
                    <span className='me-2' onClick={() => handleEdit(prop, data)}>
                        <FontAwesomeIcon icon={faPenAlt} />
                    </span>
                    <span onClick={() => handleConfirmation(prop)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </span>
                </div>)
            }
        },
    ]

    const inputs = [
        { label: 'Name', key: 'name', type: 'text', required: true },
        { label: 'Order', key: 'order', type: 'number', required: true },
    ]

    useEffect(() => {
        (async () => {
            try {
                const token = sessionStorage.getItem('token');
                const user_id = sessionStorage.getItem('userid');
                var obj = { token: token, userid: user_id }
                let response = await getLevels(obj)
                if (response) {
                    setData(response)
                }
            } catch (err) {

            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const handleCheck = (event, id) => {
        let checked = event.target.checked
        if (checked) {
            setIds(prev => [...prev, id])
        } else {
            let index = ids.indexOf(id)
            ids.splice(index, 1)
            setIds([...ids])
        }
    }

    const handleAddData = (obj) => {
        let newData = [...data]
        newData.push(obj)
        setData([...newData])
    }

    const handleUpdateData = (obj) => {
        let updatedData = data?.map(item => {
            if (item.id == obj.id) {
                item = obj
                return item
            } else {
                return item
            }
        })
        setData([...updatedData])
    }

    const handleConfirmation = (id, type = '') => {
        setDetailObj({
            text: `Are you sure want to delete?`,
            headerText: 'Delete Level',
            action: () => handleDelete(id, type),
        })
        setPopup(true)
    }

    const handleDelete = async (id, type) => {
        const token = sessionStorage.getItem('token');
        const user_id = sessionStorage.getItem('userid');
        var obj = { token: token, userid: user_id, ids: id, action: 'deleteLevel' }
        let response = await deleteData(obj)
        if (response?.success) {
            let updatedData;
            if (type == 'multi') {
                updatedData = data.filter((item) => !id?.split(',')?.includes(item.id?.toString()))
                setIds([])
            } else {
                updatedData = data.filter((item) => item.id !== id)
            }
            setData([...updatedData])
        }
    }

    const handleAdd = () => {
        setEditModal(!editModal)
        setDetailObj({
            inputs,
            action: (prop) => { addLevel(prop) },
            update: handleAddData,
            text: 'Add Level'
        })
    }

    const handleEdit = (id, data) => {
        setEditModal(!editModal)
        setDetailObj({
            inputs,
            text: 'Edit Level',
            update: handleUpdateData,
            action: (prop) => {editLevel(prop)},
            data: data
        })
    }

    const handleCheckAll = (event) => {
        setCheckAll(event.target.checked)
        if(event.target.checked) {
            let ids = data.map(item => item.id)
            setIds(ids)
        } else {
            setIds([])
        }
    }

    return (
        <Layout page={'Levels'}>
            <div className='px-3 text-end'>
                <button onClick={() => handleAdd()} className='btn btn-primary'>Add Levels</button>
                {ids?.length > 0 && <button className='btn btn-danger ms-2' onClick={() => handleConfirmation(ids.join(','), 'multi')}>Delete Selected</button>}
            </div>
            <div className="divTable">
                <TableDataComp data={data} thead={thead} pageHeading={'Levels'} loading={loading} />
                {editModal && <EditData isOpen={editModal} toggle={() => setEditModal(!editModal)} obj={detailObj} />}
                {popup && <ConfirmationPopup isOpen={popup} toggle={() => setPopup(!popup)} obj={detailObj} />}
            </div>
        </Layout>
    )
}

export default Levels