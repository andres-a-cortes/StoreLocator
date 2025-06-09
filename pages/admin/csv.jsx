import Layout from '@/components/shared/layout'
import { faCloudUpload, faDownload, faTrashAlt, faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/home.module.scss'
import { deleteData, getCSVData, uploadCSV } from '@/functions/globalFunctions'
import ConfirmationPopup from '@/components/shared/confirmationPopup'
import { Spinner } from 'reactstrap'

const Csv = () => {

    const [data, setData] = useState([])
    const [ids, setIds] = useState([])
    const [popup, setPopup] = useState(false)
    const [detailObj, setDetailObj] = useState({})
    const [toggle, setToggle] = useState(false)
    const [loading, setLoading] = useState(false)
    const [checkAll, setCheckAll] = useState(false)
    const [compLoading, setCompLoading] = useState(true)

    const importcsv = () => {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv'
        input.onchange = async () => {
            input.disabled = true
            let files = Array.from(input.files);
            let formData = new FormData()
            formData.append('csv_file', files[0])
            const token = sessionStorage.getItem('token');
            const user_id = sessionStorage.getItem('userid');
            var obj = { token: token, userid: user_id, formData: formData }
            setLoading(true)
            let response = await uploadCSV(obj)
            if (response?.success) {
                input.disabled = false
                setToggle(!toggle)
                setLoading(false)
            } else {
                setLoading(false)
            }
        }
        input.click();
    }

    const downloadCSV = (uri, name) => {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        link.click();
    }

    useEffect(() => {
        (async () => {
            const token = sessionStorage.getItem('token');
            const user_id = sessionStorage.getItem('userid');
            var obj = { token: token, userid: user_id }
            let response = await getCSVData(obj)
            if (!response?.error) {
                setCompLoading(false)
                setData(response)
            } else {
                setCompLoading(false)
            }
        })()
    }, [toggle])

    const handleConfirmation = (id, index) => {
        setDetailObj({
            text: `Are you sure want to delete?`,
            headerText: 'Delete CSV',
            action: () => handleDelete(id, index),
        })
        setPopup(true)
    }

    const handleDelete = async (id, index = '') => {
        const token = sessionStorage.getItem('token');
        const user_id = sessionStorage.getItem('userid');
        var obj = { token: token, userid: user_id, ids: id, action: 'deleteCsv' }
        let response = await deleteData(obj)
        if (response?.success) {
            if (index !== 'multi') {
                let updateData = [...data]
                updateData.splice(index, 1)
                setData([...updateData])
            } else {
                setToggle(!toggle)
                setIds([])
            }
        }
    }

    const handleCheckAll = (event) => {
        setCheckAll(event.target.checked)
        if (event.target.checked) {
            let ids = data.map(item => item.id)
            setIds(ids)
        } else {
            setIds([])
        }
    }

    return (
        <Layout page={'Manage CSV'}>
            <div className='csvPage pt-2'>
                <div className={styles.googleKeyBox}>
                    <label>Server Google Maps Key</label>
                    <input type='text' className='form-control mt-2' />
                    <button className='btn btn-primary mt-2'>Save</button>
                </div>
                <div className='uploadBox'>
                    <span className='csvBtn' onClick={importcsv}>
                        <FontAwesomeIcon icon={faCloudUpload} />
                        <label className='ms-2'>Upload CSV</label>
                    </span>
                    {loading && <Spinner className='ms-2' />}
                </div>
                <div className='tableBox'>
                    {ids?.length > 0 && <div className='text-end'>
                        <button className='btn btn-danger mb-2' onClick={() => handleDelete(ids.join(','), 'multi')}>Delete Selected</button>
                    </div>}
                    {(!compLoading && data?.length == 0) ? <h1 className='text-center'>No Data Found</h1> : <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th><input type={'checkbox'} className='form-check-input' onChange={(event) => handleCheckAll(event)} checked={checkAll} /></th>
                                <th>File Name</th>
                                <th>Date</th>
                                <th>Download</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((item, i) => {
                                return (
                                    <tr key={'csv_' + i}>
                                        <td><input type={'checkbox'} className='form-check-input' checked={ids?.includes(item.id)} onChange={() => setIds(prev => [...prev, item.id])} /></td>
                                        <td>{item.file_name?.replace('uploads/', '')}</td>
                                        <td>{item.uploaded_at}</td>
                                        <td>
                                            <button className='btn btn-success' onClick={() => downloadCSV(`https://creativedigitaltechnologies.com/storeapi/store/${item.file_name}`, 'test')}><FontAwesomeIcon icon={faDownload} />Download</button>
                                        </td>
                                        <td>
                                            <button className='btn btn-danger' onClick={() => handleConfirmation(item.id, i)}><FontAwesomeIcon icon={faTrashAlt} /> Delete</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>}
                </div>
                {popup && <ConfirmationPopup isOpen={popup} toggle={() => setPopup(!popup)} obj={detailObj} />}
            </div>
        </Layout>
    )
}

export default Csv