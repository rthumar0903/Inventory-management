import React, { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css'
export default function Dashboard() {
  const [isTableShow,setIsTableShow] = useState(true);
  const [products,setProducts] = useState([]);
  const [isUpdateProduct,setIsUpdateProduct] = useState(false)
  const [searchTerm,setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'))
  const authToken = JSON.parse(localStorage.getItem('user'))?.userToken;
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  };
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: ''
  });

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/product/get-products', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.log('error',error)
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
      ||
      product.price.toString().includes(searchTerm)
      ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
      ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
      ||
      product.createdAt.includes(searchTerm)
    );
    setFilteredProducts(
      searchTerm === '' ? products : filtered
    ); // Update `filteredProducts` state with the filtered array or all products if search term is empty
  }, [searchTerm, products]);

  const handleTableShow = async() => {
    setIsTableShow(false);
  }
  const handleAddProduct = async() => {   
    try {     
    
        const response = await fetch('http://localhost:5000/product/create-product', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(formData)
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add product');
        }
        else{
        const responseData = await response.json();
        toast.success('Product Added Successfully !!! Please, check in to Products section')
        fetchProducts()
      }
      } catch (error) {
        console.error('Error adding product:', error.message);
      }
  };
  const handleEditProduct = async(productData) =>{
    // setIsUpdateProduct(false);
    try {
      
      const productId = productData?.productId
      const response = await fetch(`http://localhost:5000/product/update-product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to edit product');
      }
      const data = await response.json();
      toast.success('Product Update Successfully !!!!')
      fetchProducts()
    } catch (error) {
      console.error('Error editing product:', error.message);
    }
  } 
  
  const handleOnEdit = (item) => {
    setIsUpdateProduct(true);
    setIsTableShow(false);
    setFormData( {...formData,
      name: item.name,
      category: item.category,
      price: item.price ,
      quantity: item.quantity,
      description:item.description,
      productId:item._id
    });
  };
  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/product/delete-product/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      else{
        toast.success('Product deleted successfully');
        fetchProducts();
    }
    } catch (error) {
      console.error('Error deleting product:', error.message);
    }
  };
  
  const handleSearch = () => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(isUpdateProduct){
      handleEditProduct(formData);
    }
    else{
    handleAddProduct(formData);
  }
    
    setFormData({
      name: '',
      category: '',
      price: '',
      quantity: '',
      description: ''
    });
  };
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Dashboard</h2>
        <ul style={{marginTop:"100px"}}>
        <li>
          <button onClick={()=>{setIsTableShow(true)}} className='btn-dashboard'>Products</button>
          </li>
          <li>
          <button onClick={handleTableShow} className='btn-dashboard'>Add Product</button>
          </li>
          <br/>
          <li>
            <button onClick={handleLogout} className='btn-dashboard'>Logout</button>
          </li>
        </ul>
      </div>
      <div className="main-content">
      <div>
      <div className="search-bar">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
      {user && (
        <p>Welcome, {user.userName}!</p>
      )}
        </div>
       {!isTableShow?
       <form onSubmit={handleSubmit} className="form-container">
       <div className="form-group">
           <label htmlFor="name">Name:</label>
           <input
           type="text"
           id="name"
           name="name"
           value={formData.name}
           onChange={handleChange}
           className="input-field"
           />
       </div>
       <div className="form-group">
           <label htmlFor="category">Category:</label>
           <input
           type="text"
           id="category"
           name="category"
           value={formData.category}
           onChange={handleChange}
           className="input-field"
           />
       </div>
       <div className="form-group">
           <label htmlFor="price">Price:</label>
           <input
           type="number"
           id="price"
           name="price"
           value={formData.price}
           onChange={handleChange}
           className="input-field"
           />
       </div>
       <div className="form-group">
           <label htmlFor="quantity">Quantity:</label>
           <input
           type="number"
           id="quantity"
           name="quantity"
           value={formData.quantity}
           onChange={handleChange}
           className="input-field"
           />
       </div>
       <div className="form-group">
           <label htmlFor="description">Description:</label>
           <textarea
           id="description"
           name="description"
           value={formData.description}
           onChange={handleChange}
           className="input-field"
           />
       </div>
       <button type="submit" className="submit-button">{isUpdateProduct?'Update Product':'Add Product'}</button>
   </form>:
   <div>
      {products?.length===0?
      <div className='empty-cart empty-container'>
        No Products
      </div>
      :
        <table className='table'>
        <thead>
        <tr>
          <th>No</th>
          <th>Product Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Description</th>
          <th>CreatedAt</th>
          <th>UpdatedAt</th>
          <th>Actions</th>
        </tr>
      </thead>
      
      <tbody>
        {filteredProducts.map((item,ind) => (
          <tr key={item.id}>
            <td>{ind+1}</td>
            <td>{item.name}</td>
            <td>{item.category}</td>
            <td>{item.price}</td>
            <td>{item.quantity}</td>
            <td>{item.description}</td>
            <td>{item.createdAt}</td>
            <td>{item.updatedAt}</td>
            <td>
              <button onClick={() => handleOnEdit(item)}>Edit</button>
              <button onClick={() => handleDeleteProduct(item?._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
        </table>
      }
      </div>
        }
    </div>
    <ToastContainer />
    </div>
  );
}
