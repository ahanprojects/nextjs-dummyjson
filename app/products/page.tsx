"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import Loader from "../components/loader";
import SnackBar from "../components/SnackBar";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('all')
  const [snackbar, setSnackbar] = useState('')
  // const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const productResponse = await fetch("https://dummyjson.com/products");
      const productsData = await productResponse.json();
      setProducts(productsData.products);

      const categoriesResponse = await fetch(
        "https://dummyjson.com/products/categories"
      );
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const headers = [
    "ID",
    "Title",
    "Description",
    "Price",
    "Disc (%)",
    "Rating",
    "Stock",
    "Brand",
    "Category",
    "Actions"
  ];

  const handleCategoryChange = async (e: any) => {
    setCategory(e.target.value);
    setIsLoading(true);
    const category = e.target.value;
    const endpoint = category == "all" ? "" : `/category/${category}`;
    try {
      const productResponse = await fetch(
        `https://dummyjson.com/products` + endpoint
      );
      const productsData = await productResponse.json();
      setProducts(productsData.products);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: any) => {
    setCategory('all');
    setIsLoading(true);
    
    try {
      const productResponse = await fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(e.target.value)}` 
      );
      const productsData = await productResponse.json();
      setProducts(productsData.products);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`https://dummyjson.com/products/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
      fetchData()
      setSnackbar("Delete success")
      setTimeout(() => setSnackbar(""), 3000)
    } catch (error) {
      
    }
    
  };

  return (
    <div className="min-h-screen space-y-12 py-12 px-8">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold flex-1">Products</h1>
        <input
          className="border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-1 rounded-lg"
          type="text"
          placeholder="Search"
          onChange={handleSearch}
        />
        <select
          value={category}
          onChange={handleCategoryChange}
          className="p-[0.3rem] border-2 border-gray-300 rounded-lg">
          <option value="all">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button>
          <Link
            href={"products/new"}
            className="px-3 py-2 bg-blue-600 rounded-md text-white font-medium">
            New Product
          </Link>
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="rounded-lg overflow-hidden border-2 border-gray-300">
          <table className=" w-full border-collapse text-left">
            <tr className="bg-gray-100">
              {headers.map((header) => (
                <th key={header} className="p-2">
                  {header}
                </th>
              ))}
            </tr>
            {products.map((v: Product) => (
              <tr key={v.id}>
                <td className="p-2">{v.id}</td>
                <td className="p-2">{v.title}</td>
                <td className="p-2">{v.description}</td>
                <td className="p-2">{v.price}</td>
                <td className="p-2">{v.discountPercentage}</td>
                <td className="p-2">{v.rating}</td>
                <td className="p-2">{v.stock}</td>
                <td className="p-2">{v.brand}</td>
                <td className="p-2">{v.category}</td>
                <td className="p-2">
                  <div className=" flex h-full gap-2 items-center ">
                    <Link
                      href={`/products/edit/${v.id}`}
                      className="bg-blue-100 p-1 rounded h-full "
                      title="Edit product">
                      <MdEdit className="text-blue-600" />
                    </Link>
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="bg-red-100 p-1 rounded "
                      title="Delete product">
                      <MdDelete className="text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </table>
        </div>
      )}
      <SnackBar message={snackbar} />
    </div>
  );
}

