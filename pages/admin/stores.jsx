import Layout from '@/components/shared/layout'
import TableDataComp from '@/components/tableData/tableData'
import { faPenAlt, faStore, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/home.module.scss'
import { getStores, deleteData } from '@/functions/globalFunctions'
import ConfirmationPopup from '@/components/shared/confirmationPopup'
import { useRouter } from 'next/router'

const Index = () => {

  const router = useRouter()

  const [data, setData] = useState([])
  const [popup, setPopup] = useState(false)
  const [detailObj, setDetailObj] = useState({})
  const [ids, setIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkAll, setCheckAll] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const token = sessionStorage.getItem('token');
        const user_id = sessionStorage.getItem('userid');
        var obj = { token: token, userid: user_id }
        let response = await getStores(obj)
        if (response) {
          setData(response)
        }
      } catch (err) {

      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const thead = [
    {
      name: () => <span><input type={'checkbox'} className='form-check-input' onChange={(event) => handleCheckAll(event)} checked={checkAll} /></span>,
      selector: ['id'],
      cell: (prop, data) => {
        return (<span><input type={'checkbox'} className='form-check-input' onChange={(event) => handleCheck(event, prop)} checked={ids.includes(data.id)} /></span>)
      }
    },
    {
      name: () => 'Store Id',
      selector: ['id'],
    },
    {
      name: () => 'Title',
      selector: ['title', 'id'],
      cell: (prop, data) => {
        return (<span className='text-primary' style={{ cursor: 'pointer' }} onClick={() => router.push(`/admin/store?id=${data.id}`)}>{prop}</span>)
      }
    },
    {
      name: () => 'latitude',
      selector: ['lat'],
    },
    {
      name: () => 'Longitude',
      selector: ['lng'],
    },
    {
      name: () => 'street',
      selector: ['street'],
    },
    {
      name: () => 'city',
      selector: ['city'],
    },
    {
      name: () => 'state',
      selector: ['state'],
    },
    {
      name: () => 'Actions',
      selector: ['id'],
      cell: prop => <div>
        <span className='me-2' onClick={() => router.push(`/admin/store?id=${prop}`)}>
          <FontAwesomeIcon icon={faPenAlt} />
        </span>
        <span onClick={() => handleConfirmation(prop)}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </span>
      </div>
    },
  ]

  
  const handleConfirmationAll = () => {
    setDetailObj({
      text: `Are you sure want to delete All Stores?`,
      headerText: 'Delete',
      action: () => handleDeleteAll(),
    })
    setPopup(true)
  }
  
  const handleDeleteAll = async () => {
    const token = sessionStorage.getItem('token');
    const user_id = sessionStorage.getItem('userid');
    var obj = { token: token, userid: user_id, action: 'deleteStoreAll', ids:"" }
    let response = await deleteData(obj)
    if (response?.success) {
      window.location.reload();
    }
  }

  const handleConfirmation = (id, type = '') => {
    setDetailObj({
      text: `Are you sure want to delete selected items?`,
      headerText: 'Delete',
      action: () => handleDelete(id, type),
    })
    setPopup(true)
  }

  const handleDelete = async (id, type) => {
    const token = sessionStorage.getItem('token');
    const user_id = sessionStorage.getItem('userid');
    var obj = { token: token, userid: user_id, ids: id, action: 'deleteStore' }
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
    <Layout page={'Stores'}>
      <div>
        <div className='px-3 text-end'>
          <button className='btn btn-primary' onClick={() => router.push('/admin/store')}>Add Store</button>
          {ids?.length > 0 && <button className='btn btn-danger ms-2' onClick={() => handleConfirmation(ids.join(','), 'multi')}>Delete Selected</button>}

          <button className='btn btn-danger ms-2' onClick={() => handleConfirmationAll()}>Delete All</button>

        </div>
        <div className={styles.divTable}>
          <TableDataComp data={data} thead={thead} pageHeading={''} loading={loading} />
        </div>
      </div>
      {popup && <ConfirmationPopup isOpen={popup} toggle={() => setPopup(!popup)} obj={detailObj} />}
    </Layout>
  )
}

export default Index