"use client";

import { ChangeEvent, useState, useEffect, useRef } from "react";
import addProduct from "./actions";
import { useFormState } from "react-dom";
import { BiImageAdd } from "react-icons/bi";

export default function NewProductPage() {
  const [state, formAction] = useFormState(addProduct, {
    error: "",
    success: true,
  });

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  const [img1, setImg1] = useState<File | null>(null)
  const [img2, setImg2] = useState<File | null>(null)
  const [img3, setImg3] = useState<File | null>(null)
  const [img4, setImg4] = useState<File | null>(null)

  // Get categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("https://dummyjson.com/products" + "/categories");
      const categoriesData = await res.json();
      setCategories(categoriesData);
    };
    fetchCategories();
  }, []);

  async function handleCategoryChange(e: ChangeEvent<HTMLSelectElement>) {
    setCategory(e.target.value);
  }

  return (
    <div className="py-8 px-12 space-y-8">
      <h1 className="py-3 text-2xl font-bold">Tambah Produk</h1>
      <p className="p-4 bg-blue-100 rounded-lg mb-8 text-sm">
        Pastikan produk Anda sudah sesuai dengan syarat dan ketentuan
        Warungpedia. Warungpedia menghimbau seller untuk menjual produk dengan
        harga yang wajar atau produk Anda dapat dihapus oleh Warungpedia sesuai
        dengan S&K yang berlaku.
      </p>
      {/* Upload Produk */}
      <div className="p-8 border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold pb-8">Upload Produk</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold pb-4">Foto Produk</h3>
            <p className="text-sm text-gray-400">
              Pastikan foto memiliki format JPG atau PNG dan memiliki ukuran
              minimum 700 x 700 px.
            </p>
          </div>
          <div className="flex gap-4 flex-[2]">
            <ImageUploader label='Utama' file={img1} onFileSelect={(file) => setImg1(file)} />
            <ImageUploader label='Depan' file={img2} onFileSelect={(file) => setImg2(file)} />
            <ImageUploader label='Samping' file={img3} onFileSelect={(file) => setImg3(file)} />
            <ImageUploader label='Belakang' file={img4} onFileSelect={(file) => setImg4(file)} />
          </div>
        </div>
      </div>
      {/* Informasi Produk */}
      <div className="p-8 border border-gray-300 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold pb-8">Informasi Produk</h2>
        <Input
          label="Nama Produk"
          name="title"
          placeholder="Contoh: Sepatu Pria Kulit Coklat"
        />
        <div className="flex gap-4 items-center">
          <h3 className="flex-1">Deskripsi Produk</h3>
          <textarea
            name="title"
            className="border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded block flex-[2]"
            placeholder="Ceritakan lebih lanjut tentang produk..."
          />
        </div>
        <Input
          label="Brand Produk"
          name="brand"
          placeholder="Nama merek atau brand produk"
        />
        <div className="flex gap-4 items-center">
          <h3 className="flex-1">Kategori Produk</h3>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="p-[0.5rem] border-2 border-gray-300 rounded flex-[2]">
            <option value="">Pilih kategori</option>
            {categories &&
              categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>
        </div>
        <Input
          label="Stock Produk"
          name="stock"
          placeholder="Jumlah produk yang tersedia"
          type="number"
        />
      </div>
      <div className="p-8 border border-gray-300 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold pb-8">Harga Produk</h2>
        <Input
          label="Harga Produk"
          name="price"
          type="number"
          placeholder="Masukkan harga produk"
        />
        <Input
          label="Diskon Produk (%)"
          name="discountPercentage"
          type="number"
          placeholder="Masukkan diskon produk 0-100"
        />
        <Input
          label="Rating Produk"
          name="rating"
          placeholder="Masukkan rating 1-5"
        />
      </div>
      <div className='flex gap-4 justify-end'>
        <button className="px-8 py-2 font-semibold rounded-lg">Kembali</button>
        <button className="px-8 py-2 bg-blue-600 text-white font-semibold rounded-lg">Simpan</button>
      </div>
    </div>
  );
}

function ImageUploader({ label, file, onFileSelect}: { label: string, file: File | null, onFileSelect: (file: File | null) => void}) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    onFileSelect(file || null);
  };

  return (
    <button className="flex-1 border border-dashed border-gray-400 rounded-lg aspect-square p-8 flex flex-col justify-center items-center gap-2 overflow-hidden" onClick={() => inputRef.current?.click()}>
      <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" ref={inputRef} />
      { file ? <img src={URL.createObjectURL(file)} alt='label' className="object-cover w-full">
      
      </img> : <>
      <BiImageAdd size={36} className="text-gray-400" />
      <p className="text-sm text-gray-400">{label}</p>
      
      </> }
    </button>
  );
}

function Input({
  name,
  label,
  placeholder,
  type = "text",
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="flex gap-4 items-center">
      <h3 className="flex-1">{label}</h3>
      <input
        name={name}
        className="border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded block flex-[2]"
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}
