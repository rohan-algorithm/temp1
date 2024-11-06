import React, { useState, useContext, useEffect } from 'react';
import './Add.css';
import { assets, url } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = () => {
    const [images, setImages] = useState([]);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "All",
        college: "NIT Allahabad",
    });

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (images.length === 0) {
            toast.error('No images selected');
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("college", data.college); 
        images.forEach((image) => {
            formData.append("images", image); // Use "images" as the key
        });

        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            console.log("formData", formData);
            const response = await axios.post(`${url}/api/food/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` // Add the token to the headers
                }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: data.category,
                    college: data.college,
                });
                setImages([]);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("There was an error uploading the images!", error);
            toast.error('Error uploading images');
        }
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(data => ({ ...data, [name]: value }));
    };

    const onImageChange = (event) => {
        setImages([...event.target.files]);
    };

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className='add-img-upload flex-col'>
                    <p>Upload images</p>
                    <input
                        onChange={onImageChange}
                        type="file"
                        accept="image/*"
                        id="images"
                        hidden
                        multiple
                    />
                    <label htmlFor="images">
                        <div className="image-preview-container">
                            {images.length === 0 ? (
                                <img
                                    src={assets.upload_area}
                                    alt="Upload Preview"
                                />
                            ) : (
                                images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview ${index}`}
                                        className="image-preview"
                                    />
                                ))
                            )}
                        </div>
                    </label>
                </div>
                <div className='add-product-name flex-col'>
                    <p>Product name</p>
                    <input
                        name='name'
                        onChange={onChangeHandler}
                        value={data.name}
                        type="text"
                        placeholder='Type here'
                        required
                    />
                </div>
                <div className='add-product-description flex-col'>
                    <p>Product description</p>
                    <textarea
                        name='description'
                        onChange={onChangeHandler}
                        value={data.description}
                        type="text"
                        rows={6}
                        placeholder='Write content here'
                        required
                    />
                </div>
                <div className='add-category-price'>
                    <div className='add-category flex-col'>
                        <p>Product category</p>
                        <select name='category' onChange={onChangeHandler} value={data.category}>
                            <option value="ALL">ALL</option>
                            <option value="Cycle">Cycle</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Gadgets">Gadgets</option>
                            <option value="Books">Books</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className='add-category flex-col'>
                        <p>Select College</p>
                        <select name='college' onChange={onChangeHandler} value={data.college}>
                            <option value="NIT Allahabad">NIT Allahabad</option>
                            <option value="IIT Kanpur">IIT Kanpur</option>
                            <option value="IIIT Allahabad">IIIT Allahabad</option>
                            <option value="NIT Bhopal">NIT Bhopal</option>
                            <option value="IIT Delhi">IIT Delhi</option>
                            <option value="IIT Bombay">IIT Bombay</option>
                        </select>
                    </div>
                    <div className='add-price flex-col'>
                        <p>Product Price</p>
                        <input
                            type="number"
                            name='price'
                            onChange={onChangeHandler}
                            value={data.price}
                            placeholder='Enter price'
                            required
                        />
                    </div>
                </div>
                <button type='submit' className='add-btn'>ADD</button>
            </form>
        </div>
    );
};

export default Add;