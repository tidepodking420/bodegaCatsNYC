import {useState} from 'react';
const SERVER_URL = "http://127.0.0.1:5000";
const CAT_URL = SERVER_URL + "/cat"
import type {Cat} from './CatViewer'

export function SingleCat({permissions, cat, cats, catSetter}: {permissions: number, cat: Cat,cats: Array<Cat>, catSetter: any}){
      function deleteCat(cat_id: string) {
                const deleteCatURL = `${CAT_URL}?cat_id=${cat_id}`;
                fetch(deleteCatURL, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(res => res.json()).then(_data => {
                    catSetter(cats.filter(x => x.id !== cat_id))
                })
            }
    
        function modifyCat(cat_id: string) {
            const deleteCatURL = `${CAT_URL}?cat_id=${cat_id}`;
            fetch(deleteCatURL, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cat_id,
                    fieldToUpdate,
                    newValue: catTextField
                })
            }).then(res => res.json()).then(data => {
            })
        }

        const adminMode = permissions === 0;
        const [catTextField, setCatTextField] = useState('');
        const [fieldToUpdate, setFieldToUpdate] = useState('name');
        const handleFieldChange = (e) => {
            setFieldToUpdate(e.target.value);
        };
        return (
            <div>
                {adminMode && <button style={{position: 'relative', top: '1em'}} onClick={() => deleteCat(cat.id)}>Delete {cat.name}</button>}
                <p style={{fontWeight: 'bold', marginBottom: '0px'}}>name: {cat.name}</p>
                <p style={{fontWeight: 'bold', marginTop: '1px', marginBottom: '1px'}}>desc: {cat.desc}</p>
                {adminMode && 
                <div>
                    <div>
                        <div style={{display: 'flex'}}>
                            <p>Updating: {fieldToUpdate}</p> 
                            <div style={{position: 'relative', top: '.9vw', left: '1vw'}}>
                                <button onClick={() => modifyCat(cat.id)}
                                disabled={!catTextField.length}>Update</button>
                            </div>
                        </div>
                        <div>
                            <label>
                                <input
                                type="radio"
                                value="name"
                                checked={fieldToUpdate === 'name'}
                                onChange={handleFieldChange}
                                />
                                Name
                            </label>

                            <label>
                                <input
                                type="radio"
                                value="desc"
                                checked={fieldToUpdate === 'desc'}
                                onChange={handleFieldChange}
                                />
                                Description
                            </label>
                        </div>
                    </div>
                    <input
                    type="text"
                    value={catTextField}
                    onChange={(e) => setCatTextField(e.target.value)}
                    placeholder={`${fieldToUpdate === 'name' ? 'Name': 'Desc'} of the Cat?`}
                />
                </div>
                }
                <div style={{border: 'none', height: '.3em', backgroundColor: 'black', marginTop: '.4em'}}> </div>
            </div>
        );
}