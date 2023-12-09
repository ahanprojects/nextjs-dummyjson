"use client";

import Link from "next/link";
import { ChangeEvent, MouseEventHandler, useEffect, useState } from "react";
import { FaSearch, FaAngleRight, FaAngleLeft } from "react-icons/fa";
import Loader from "../components/Loader";
import useDynamicFetch from "../hooks/useDynamicFetch";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
};

type ProductResponse = {
  products: Product[];
  skip: number;
  limit: number;
  total: number
};

// API Configuration
const DOMAIN = "https://dummyjson.com/products"
const FILTER = `?select=id,title,description,price,category&limit=0`

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('all')

  const { data, loading, error, updateUrl }  = useDynamicFetch<ProductResponse>(DOMAIN + FILTER);
  
  // Get categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(DOMAIN + "/categories");
      const categoriesData = await res.json();
      setCategories(categoriesData);
    }
    fetchCategories()
  }, [])

  const headers = ["Title", "Description", "Price", "Category", "Actions"];

  async function handleCategoryChange(e: ChangeEvent<HTMLSelectElement>) {
    setSearch('')

    const value = e.target.value;
    setCategory(value)
    const endpoint = value == "all" ? "" : `/category/${value}`;
    updateUrl(`${DOMAIN}${endpoint}${FILTER}`);
  };

  async function handleSearch() {
    setCategory('all')
    updateUrl(`${DOMAIN}/search${FILTER}&q=${search}`);
  };

  return (
    <div className="min-h-screen space-y-12 py-12 px-8">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold flex-1">Products</h1>
        <div className='flex gap-1 items-center'>
          <input
            value={search}
            className="border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-1 rounded-lg"
            type="text"
            placeholder="Search"
            onChange={(e) => { setSearch(e.target.value) }}
          />
          <button className="bg-blue-100 p-2.5 rounded-lg" onClick={handleSearch}>
            <FaSearch className='text-blue-600' />
          </button>
        </div>
        <select
          value={category}
          onChange={handleCategoryChange}
          className="p-[0.3rem] border-2 border-gray-300 rounded-lg">
          <option value="all">All</option>
          {categories &&
            categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
        </select>

        <button>
          <Link
            href={"products/new"}
            className="px-3 py-2 bg-blue-600 rounded-md text-white font-medium">
            Tambah Produk
          </Link>
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div>
          <div className="rounded-lg overflow-hidden border-2 border-gray-300">
            <table className=" w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-100">
                  {headers.map((header) => (
                    <th key={header} className="p-2">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.products.map((v: Product) => (
                    <tr key={v.id}>
                      <td className="p-2">{v.title}</td>
                      <td className="p-2">{v.description}</td>
                      <td className="p-2">Rp{v.price.toLocaleString()}</td>
                      <td className="p-2">{v.category}</td>
                      <td className="p-2">
                        <Link
                          href={`/products/${v.id}`}
                          className="rounded h-full text-blue-700 underline"
                          title="Detail">
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
