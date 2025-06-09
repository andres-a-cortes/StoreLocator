import Layout from '@/components/shared/layout'
import MapComp from '@/components/mapComp'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/home.module.scss'
import { addStore, editStore, getStoreById, getLevels, getBrands, getCategories } from '@/functions/globalFunctions'
import { useRouter } from 'next/router'

function Store() {

    const router = useRouter()

    const [dataObj, setDataObj] = useState({})
    const [dataObjCategory, setDataObjCategory] = useState({})
    const [dataObjBrand, setDataObjBrand] = useState({})
    const [dataObjLevels, setDataObjLevels] = useState({})
    const [isCheckedPrefered, setIsCheckedPrefered] = useState(false);

    const [edit, setEdit] = useState(false)

    const handleInput = (event) => {
        let value = event.target.value
        let name = event.target.name
        setDataObj({ ...dataObj, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = sessionStorage.getItem('token');
        const user_id = sessionStorage.getItem('userid');
        var obj = { token: token, userid: user_id, body: dataObj, id: router?.query.id }
        let response;
        if (edit) {
            obj.body.storeid = router?.query.id
            response = await editStore(obj)
        } else {
            response = await addStore(obj)
        }
        if (response?.success) {
            router.push('/admin/stores')
        }
    }

    const handleChangeMulti = (event) => {
        const values = Array.from(event.target.selectedOptions, (option) => option.value);
        const commaSeparatedValues = values.join(","); 
        setDataObj({ ...dataObj, ["categories"]: commaSeparatedValues })

    };
    
    const handleInputPrefered = (event) => {
        console.log("Checkbox Selected:", event.target.checked);
        if(event.target.checked){
            setDataObj({ ...dataObj, ["preferred_provider"]: 1 })
        }
        else{
            setDataObj({ ...dataObj, ["preferred_provider"]: 0 })
        }        
    };

    useEffect(() => {
        if (router?.query.id) {
            (async () => {
                const token = sessionStorage.getItem('token');
                const user_id = sessionStorage.getItem('userid');
                var obj = { token: token, userid: user_id, id: router?.query.id }
                let response = await getStoreById(obj)
                if (response) {
                    await setDataObj(response[0])
                }

                var obj = { token: token, userid: user_id }
                let responseLevels = await getLevels(obj)
                if (responseLevels) {
                    await setDataObjLevels(responseLevels)
                }
                let responseBrands = await getBrands(obj)
                if (responseBrands) {
                    await setDataObjBrand(responseBrands)
                }
                let responseCategories = await getCategories(obj)
                if (responseCategories) {
                    await setDataObjCategory(responseCategories)
                }

            })()
            setEdit(true)
        }
    }, [router])

    return (
        <Layout page={'Create Store'}>
            <div className={`${styles.createStore}`}>
                <form onSubmit={handleSubmit}>
                    <div className={`${styles.formBox}`}>
                        <span className='mt-3'>
                            <label>Title</label>
                            <input type="text" name="title" onChange={handleInput} required value={dataObj.title || ''} className='form-control' />
                        </span>
                        <span className='mt-3'>
                            <label>Website</label>
                            <input type="url" name="website" onChange={handleInput}  value={dataObj.website || ''} className='form-control' />
                        </span>
                        <span className='mt-3'>
                            <label>Description</label>
                            <textarea type="text" name="description" onChange={handleInput} required value={dataObj.description || ''} className='form-control' />
                        </span>
                        <span className='mt-3'>
                            <label>Additional Description</label>
                            <textarea type="text" name="description_2" onChange={handleInput}   value={dataObj.description_2 || ''} className='form-control' />
                        </span>
                        <span className='mt-3'>
                            <label>Phone</label>
                            <input type="number" name="phone" onChange={handleInput} required value={dataObj.phone || ''} className='form-control' />
                        </span>
                        <span className='mt-3'>
                            <label>Fax</label>
                            <input type="number" name="fax" onChange={handleInput}  value={dataObj.fax || ''} className='form-control' />
                        </span>
                        <span className='mt-3'>
                            <label>Email</label>
                            <input type="email" name="email" onChange={handleInput} required value={dataObj.email || ''} className='form-control' />
                        </span>
                        <span className='mt-3'>
                            <label>Street</label>
                            <input type="text" name="street" onChange={handleInput} required value={dataObj.street || ''} className='form-control' />
                        </span>
                        <span className='mt-3'>
                            <label>City</label>
                            <input type="text" name="city" onChange={handleInput} required value={dataObj.city || ''} className='form-control' />
                        </span>
                        <span className='mt-3'>
                            <label>State</label>
                            <input type="text" name="state" onChange={handleInput} required value={dataObj.state || ''} className='form-control' />
                        </span>
                        <span className='mt-3'>
                            <label>Postal Code</label>
                            <input type="number" name="postal_code" onChange={handleInput} required value={dataObj.postal_code || ''} className='form-control' />
                        </span>
                        <span className='mt-3'>
                            <label>Country</label>
                            <input type="text" name="country" onChange={handleInput} required value={dataObj.country || ''} className='form-control' />
                        </span>
                        {/* <span className='mt-3'>
                            <APIProvider apiKey={globalConfig.googleKey}>
                                <Map
                                    style={{ width: '100%', height: '500px' }}
                                    defaultCenter={{ lat: 22.54992, lng: 0 }}
                                    defaultZoom={3}
                                    gestureHandling={'greedy'}
                                    disableDefaultUI={true}
                                />
                            </APIProvider>
                        </span> */}
                        <span className='mt-3'>
                            <label>Latitude</label>
                            <input type="number" name="lat" onChange={handleInput} required value={dataObj.lat || ''} className='form-control' />
                        </span>
                        <span className='mt-3'>
                            <label>Longitude</label>
                            <input type="number" name="lng" onChange={handleInput} required value={dataObj.lng || ''} className='form-control' />
                        </span>
                        <span className='mt-3'>
                            <label>Level</label>
                            <select name="special" onChange={handleInput} className='form-control select-control' > 
                                {dataObjLevels != undefined && dataObjLevels.length > 0 && dataObjLevels.map((row, index) => {
                                    let found = false;
                                    if(dataObj.special == row.name){
                                        found = true;
                                    }                                    
                                    return (
                                            <option selected={found} >{row.name}</option>
                                    );
                                })}
                            </select>
                        </span>
                        
                        <span className='mt-3'>
                            <label>Brand</label>
                            <select name="brand" onChange={handleInput}  className='form-control select-control' > 
                                {dataObjBrand != undefined && dataObjBrand.length > 0 && dataObjBrand.map((row, index) => {
                                    let exists = dataObj.brand
                                    let found = false;
                                    if(dataObj.brand == row.name){
                                        found = true;
                                    } 
                                    return (
                                            <option selected={found} >{row.name}</option>
                                    );
                                })}
                            </select>
                        </span>
                      
                        <span className='mt-3'>
                            <label>Categories</label>
                            <select className='custom-multi-select form-control select-control' multiple onChange={handleChangeMulti}  > 
                                {dataObj != undefined && dataObjCategory != undefined && dataObjCategory.length > 0 && dataObjCategory.map((row, index) => {
                                    console.log("dataObj.categories", dataObj.categories)
                                    
                                    let found = false;
                                    if(dataObj.categories != undefined && typeof dataObj.categories === "string"){
                                        let exists = dataObj.categories.split(",")                                    
                                        {exists.map((item, index) => {
                                            if(item == row.id){
                                                found = true; 
                                            }
                                        })}
                                    }
                                    return (
                                            <option value={row.id} selected={found} >{row.name}</option>
                                    );
                                })}
                            </select> 
                        </span>
                        <span className='mt-3'>
                            <label className='mt-3'>
                                {dataObj.preferred_provider == 1 ? 
                                    <input type='checkbox'  onChange={handleInputPrefered} checked="checked" />
                                    :
                                    <input type='checkbox'  onChange={handleInputPrefered}  />
                                }                                
                                &nbsp; Prefered Provider
                            </label>
                        </span>
                        <div className='text-center w-100 mt-3'>
                            
                        </div>
 
                        <MapComp latitude={dataObj.lat} longitude={dataObj.lng}   />
                          
                        <div className='text-center w-100 mt-3'>
                            <button className='mt-2 btn btn-primary text-white' type='submit'>{edit ? 'Update' : 'Create'} Store</button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default Store