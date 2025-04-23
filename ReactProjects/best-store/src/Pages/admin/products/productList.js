import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProductList (){

    const [products, setProducts] = useState([])


   // pagination functionality 
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const pageSize = 5


    // search functionality

    const [search, setSearch] = useState("")


    function getProducts(){
        let url = "http://localhost:4000/products?_sort=id&_order=desc&_page=" + currentPage +"&_limit=" + pageSize 
        + "&q=" + search
        console.log("url=" + url)
        fetch(url)
        .then(response => {
            if(response.ok){
                let totalCount = response.headers.get('X-Total-Count')
                console.log("X-Total-Count:" + totalCount)
                let pages = Math.ceil(totalCount / pageSize)
                console.log("Total Pages:" + pages)
                setTotalPages(pages)
                return response.json()
            }
            throw new Error()
        })
        .then(data => {
            setProducts(data)
        })
        .catch(error =>{
            alert("Unable to get the data")
        })
    }

    useEffect(getProducts, [currentPage, search])


    function deleteProduct(id){
        fetch("http://localhost:4000/products/" + id, {
            method: "DELETE"
        })
            .then(response => {
              if (!response.ok){
                throw new Error()
             }
                
                getProducts()  
            })
            .catch(error => {
             alert("Unable to delete the product")
             })
    }


       // pagination functionality
    let paginationButtons = []
    for(let i = 1; i <= totalPages; i++) {
        paginationButtons.push(
            <li className={i === currentPage ? "page-item active" : "page-item"} key={i}>
                <a className="page-link" href={"?page=" + i} 
                onClick={event => {
                    event.preventDefault()

                    setCurrentPage(i)
                }}
                >{i}</a>
            </li>
        )
    }

     // search functionality
    function handleSearch(event) {
       event.preventDefault()

       let text = event.target.search.value
       setSearch(text)
       setCurrentPage(1)
    }

    return (
        <div className="container my-4">
            <h2 className="text-center mb-4">Products</h2>

            <div className="row mb-3">
                <div className="col">
                    <Link className="btn btn-primary me-1" to="/admin/products/create" role="button">Create Product</Link>
                    <button type="button" className="btn btn-outline-primary" onClick={ getProducts }>Refresh</button>
                </div>
                <div className="col">
                    <form className="d-flex" onSubmit={handleSearch}>
                       <input className="form-control me-2" type="search" placeholder="Search" name="search"/>
                       <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Image</th>
                        <th>Created At</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map((product, index) =>{
                            return (
                                <tr key={index}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.category}</td>
                                    <td>{product.price}$</td>
                                    <td><img src={"http://localhost:4000/images/" + product.imageFilename} width="100" alt="..." /></td>
                                    <td>{product.createdAt.slice(0, 10)}</td>
                                    <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                                        <Link className="btn btn-primary btn-sm me-1" to={"/admin/products/edit/" + product.id}>Edit</Link>
                                        <button type="button" className="btn btn-danger btn-sm"
                                        onClick={() => deleteProduct(product.id)}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <ul className="pagination">{paginationButtons}</ul>
        </div>
    )
}