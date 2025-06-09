import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import style from './style.module.scss'
import { Spinner } from 'reactstrap';
// import { Table } from 'reactstrap';

function TableDataComp(props) {
    let dataPerPage = 15
    const [data, setData] = useState()
    const [pageCount, setPageCount] = useState(false)
    const [itemOffset, setItemOffset] = useState(0)
    const [currentItems, setCurrentItems] = useState([])
    const [search, setSearch] = useState('')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(15)
    const [forcePage, setForcePage] = useState(null)

    useEffect(() => {
        setData(props.data)
    }, [props.data])

    const filteredData = (search !== '' ? data : currentItems).filter((el) => {
        if (search === '') {
            return el;
        }
        else {
            for (var i = 0; i < props.thead.length; i++) {
                let valString = el[props.thead[i].selector] ? el[props.thead[i].selector].toString() : ''
                if (valString.toLowerCase().includes(search.toLowerCase())) {
                    return el
                }
            }
        }
    })

    useEffect(() => {
        if (data?.length > 0) {
            let endOffset = itemOffset + dataPerPage;
            let pageCount = Math.ceil((search !== '' ? filteredData.length : data.length) / dataPerPage)
            setPageCount(pageCount)
            setCurrentItems((search !== '' ? filteredData : data))
            if (search !== '') {
                let selectedPage = (itemOffset) / dataPerPage
                if (pageCount < selectedPage + 1) {
                    setItemOffset(0)
                    setForcePage(0)
                    setFrom(1)
                    setTo(50)
                }
                if (filteredData.length < dataPerPage) {
                    let items = dataPerPage - filteredData.length
                    setTo((selectedPage + 1 * dataPerPage) - items)
                }
            }
        }
        return () => { }
    }, [data, itemOffset, search])

    useEffect(() => {
        if (search == '') {
            setFrom(1)
            setTo(15)
            setForcePage(0)
        }
    }, [search])

    const handlePageClick = (event) => {
        let newOffset = (event.selected * dataPerPage) % data.length
        setItemOffset(newOffset)
        handlePages(event.selected + 1, newOffset)
    }

    const handlePages = (selectedPage, newOffset) => {
        let endOffset = newOffset + dataPerPage;
        let currentPageData = (search !== '' ? filteredData : data).slice(newOffset, endOffset)
        setForcePage(selectedPage - 1)
        if (selectedPage > 1) {
            setFrom((selectedPage * dataPerPage) - 14)
            if (currentPageData.length < dataPerPage) {
                let items = dataPerPage - currentPageData.length
                setTo((selectedPage * dataPerPage) - items)
            } else {
                setTo(selectedPage * dataPerPage)
            }
        } else {
            setFrom(1)
            setTo(15)
        }
    }

    const handleSearch = (e) => {
        setSearch(e.target.value)
    }

    const pagination = () => {
        return (
            <ReactPaginate
                breakLabel="..."
                nextLabel="Next"
                onPageChange={(event) => handlePageClick(event)}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="Previous"
                renderOnZeroPageCount={null}
                activeClassName={`${style.selected}`}
                previousClassName={`${style.previous}`}
                nextClassName={`${style.next}`}
                disabledClassName={`${style.disabled}`}
                forcePage={forcePage}
            />
        )
    }

    if(filteredData?.length == 0 && props.loading) return (<div className='d-flex align-items-center justify-content-center'><Spinner /></div>)
    return (
        <div className={`${style.page_main}`}>
            {
                data?.length ?
                    <>
                        <div className={`${style.tableBody} ${style.no_sort}`}>
                            <div className={`${style.table_header}`}>
                                <span className={`d-flex`}>
                                    {/* <h5 className="mb-0">{props.pageHeading}</h5>({data.length} items) */}
                                </span>
                                <span className="d-flex">
                                
                                {props.pageHeading != "Levels" && 
                                    <label>Showing {from} to {to} of {filteredData.length} items {search !== '' && `(filtered from ${data.length} total entries)`}</label>
                                }
                                </span>
                                <span className={`${style.search}`}>
                                    <input placeholder="Quick Find" type="text" value={search} onChange={(e) => handleSearch(e)} />
                                    <FontAwesomeIcon icon={faSearch} color={'#999'} />
                                </span>
                            </div>
                            <div className={style.tableScroll}>
                                <table className={`${style.data_table}`}>
                                    <thead>
                                        <tr>
                                            {props.thead.map((val, index) => {
                                                return (
                                                    <th key={'tableHeader_' + index}>{val.name()}</th>
                                                )
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.slice(itemOffset, (itemOffset + dataPerPage)).map((row, index) => {
                                            return (
                                                <tr key={'range_' + index}>
                                                    {props.thead.map((val, i) => {
                                                        return (
                                                            <React.Fragment key={'tableRow_' + i}>
                                                                <td>{val.cell == undefined ? row[val.selector] : val.cell(row[val.selector[0]], row)}</td>
                                                            </React.Fragment>
                                                        )
                                                    })}
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className={`${style.page_footer} d-flex justify-content-center border-top`}>
                                {/* <label>Showing {from} to {to} of {filteredData.length} items {search !== '' && `(filtered from ${data.length} total entries)`}</label> */}
                                
                                {props.pageHeading != "Levels" && 
                                    pagination()
                                }
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <h1 className={style.not_found}>No Data Found</h1>
                    </>
            }
        </div>
    )
}

export default TableDataComp