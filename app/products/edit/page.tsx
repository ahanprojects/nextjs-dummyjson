"use client";

import { ChangeEvent, useState, useEffect, useRef, useTransition } from "react";
import addProduct from "./actions";
import { BiImageAdd } from "react-icons/bi";
import ProductSchema from "@/app/schemas/productSchema";
import Loader from "@/app/components/Loader";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";
import { Product } from "@/app/types/product";

type ProductForm = {
  title: string,
    description: string,
    price: string,
    discountPercentage: string,
    stock: string,
    brand: string,
    category: string,
    rating: string,
    thumbnail: string,
    images: string[]
}

export default function ProductFormPage() {
  const [isPending, startTransition] = useTransition()
  
  const [formData, setFormData] = useState<ProductForm>({
    title: "",
    description: "",
    price: "",
    discountPercentage: "",
    stock: "",
    brand: "",
    category: "",
    rating: "",
    thumbnail: "",
    images: ['', '', '']
  });

  const [categories, setCategories] = useState([]);
  
  const noErrors = {
    title: "",
    description: "",
    price: "",
    discountPercentage: "",
    stock: "",
    brand: "",
    category: "",
    rating: "",
    thumbnail: "",
    images: ""
  }
  const [errors, setErrors] = useState(noErrors);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const path = usePathname()
  const id: string | null = path.endsWith('edit') ? path.split("/")[2] : null

  // Get categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("https://dummyjson.com/products" + "/categories");
      const categoriesData = await res.json();
      setCategories(categoriesData);
    };
    fetchCategories();
  }, []);

  // Get Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://dummyjson.com/products/${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const r: Product = await response.json();
        setFormData({ 
          title: r.title,
          description: r.description,
          price: r.price.toString(),
          discountPercentage: r.discountPercentage.toString(),
          rating: r.rating.toString(),
          stock: r.stock.toString(),
          brand: r.brand,
          category: r.category,
          thumbnail: r.thumbnail,
          images: r.images,
         })
      } catch (error) {
        
      } 
    };
    fetchData();
  }, []);

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  }

  function handleImageUpload(src: string, index: number) {
    if (index == -1) {
      setFormData({...formData, thumbnail: src})
      return
    }
    const images = [...formData.images]
    images[index] = src

    setFormData({...formData, images: images})
  }

  function handleSubmit() {
    // Convert strings into numbers, add images
    const data = {
      ...formData,
      price: formData.price === '' ? -1 : Number(formData.price),
      discountPercentage: formData.discountPercentage === '' ? -1 : Number(formData.discountPercentage),
      rating: formData.rating === '' ? -1 : Number(formData.rating),
      stock: formData.stock === '' ? -1 : Number(formData.stock),
    };

    const validation = ProductSchema.safeParse(data);

    if (!validation.success) {
      const newErrors: any = {...noErrors};
      console.error("Validation errors:");
      validation.error.errors.forEach((err) => {
        const field = err.path[0];
        newErrors[field] = err.message;
        console.error(field, err.message)
      });
      setErrors(newErrors);
      return
    }

    // Reset Errors
    setErrors({...noErrors})

    dialogRef.current?.showModal();
  }

  function submitForm() {
    const data: Product = {
      ...formData,
      price: Number(formData.price),
      discountPercentage: Number(formData.discountPercentage),
      rating: Number(formData.rating),
      stock: Number(formData.stock),
    };

    startTransition(async () => { 
     const response = await addProduct(data, id) 
     if (response.success) {
      redirect('/products')
     }
     dialogRef.current?.close()
    })
  }

  return (
    <>
      {/* Dialog */}
      <dialog
        className="bg-white shadow-lg p-8 rounded-lg"
        ref={dialogRef}>
        { isPending ? <Loader /> :
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{id ? 'Ubah' : 'Tambah'} Produk</h3>
          <p className="pb-4">Anda yakin akan {id ? 'mengubah' : 'menambah'} produk?</p>
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => {
                dialogRef.current?.close();
              }}>
              Batal
            </button>
            <button onClick={submitForm}>OK</button>
          </div>
        </div>
         }
      </dialog>
      {/* Form */}
      <form className="py-8 px-12 space-y-8">
        <h1 className="py-3 text-2xl font-bold">{id ? 'Ubah' : 'Tambah'} Produk</h1>
        <p className="p-4 bg-blue-100 rounded-lg mb-8 text-sm">
          Pastikan produk Anda sudah sesuai dengan syarat dan ketentuan
          Warungpedia. Warungpedia menghimbau seller untuk menjual produk dengan
          harga yang wajar atau produk Anda dapat dihapus oleh Warungpedia
          sesuai dengan S&K yang berlaku.
        </p>
        {/* Upload Produk */}
        <div className="p-8 border border-gray-300 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold pb-8">Upload Produk</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex-1 flex gap-2">
                <h3 className="text-lg font-semibold pb-4">Foto Produk</h3>
                <p className="p-1 bg-gray-100 text-gray-700 text-xs rounded h-fit">
                  Wajib
                </p>
              </div>
              <p className="text-sm text-gray-400">
                Pastikan foto memiliki format JPG atau PNG dan memiliki kualitas
                yang baik
              </p>
                { (errors.thumbnail || errors.images) &&  <p className="text-red-600 text-sm pt-8">Seluruh foto wajib diisi</p>}
            </div>
            <div className="flex gap-4 flex-[2]">
              <ImageUploader
                label="Utama"
                src={formData.thumbnail}
                onFileSelect={(src) => handleImageUpload(src, -1)}
              />
              { formData.images.map((src, i) => <ImageUploader
                label={`Foto ${i+1}`}
                src={src}
                key={i}
                onFileSelect={(src) => handleImageUpload(src, i)}
              />) }
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
            value={formData.title}
            error={errors.title}
            onChange={handleInputChange}
          />
          <div className="flex gap-4 items-center">
            <div className="flex-1 flex gap-2">
              <h3>Deskripsi Produk</h3>
              <p className="p-1 bg-gray-100 text-gray-700 text-xs rounded">
                Wajib
              </p>
            </div>
            <div className="flex-[2]">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded block w-full"
                placeholder="Ceritakan lebih lanjut tentang produk..."
              />
              {errors.description && <p className="text-red-600 text-sm pt-1">{errors.description}</p>}
            </div>
          </div>
          <Input
            label="Brand Produk"
            name="brand"
            placeholder="Nama merek atau brand produk"
            value={formData.brand}
            error={errors.brand}
            onChange={handleInputChange}
          />
          <div className="flex gap-4 items-center">
            <div className="flex-1 flex gap-2">
              <h3>Kategori Produk</h3>
              <p className="p-1 bg-gray-100 text-gray-700 text-xs rounded">
                Wajib
              </p>
            </div>
            <div className="flex-[2]">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="p-[0.5rem] border-2 border-gray-300 rounded w-full">
                <option value="">Pilih kategori</option>
                {categories &&
                  categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
              {errors.category && <p className="text-red-600 text-sm pt-1">{errors.category}</p>}
            </div>
          </div>
          <Input
            label="Stock Produk"
            name="stock"
            placeholder="Jumlah produk yang tersedia"
            type="number"
            value={formData.stock}
            error={errors.stock}
            onChange={handleInputChange}
          />
        </div>
        <div className="p-8 border border-gray-300 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold pb-8">Harga Produk</h2>
          <Input
            label="Harga Produk"
            name="price"
            type="number"
            placeholder="Masukkan harga produk"
            value={formData.price}
            error={errors.price}
            onChange={handleInputChange}
          />
          <Input
            label="Diskon Produk (%)"
            name="discountPercentage"
            type="number"
            placeholder="Masukkan diskon produk 0-100"
            value={formData.discountPercentage}
            error={errors.discountPercentage}
            onChange={handleInputChange}
          />
          <Input
            label="Rating Produk"
            type="number"
            name="rating"
            placeholder="Masukkan rating 1-5"
            value={formData.rating}
            error={errors.rating}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex gap-4 justify-end">
          <Link className="px-8 py-2 font-semibold rounded-lg" href={'/products'}>Kembali</Link>
          <button
            type="button"
            className="px-8 py-2 bg-blue-600 text-white font-semibold rounded-lg"
            onClick={handleSubmit}>
            Simpan
          </button>
        </div>
      </form>
    </>
  );
}

function ImageUploader({
  label,
  src,
  onFileSelect,
}: {
  label: string;
  src: string;
  onFileSelect: (src: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      onFileSelect(URL.createObjectURL(file));
    }
    
  };

  return (
    <button
      type="button"
      className="flex-1 border border-dashed border-gray-400 rounded-lg aspect-square flex flex-col justify-center items-center gap-2 overflow-hidden"
      onClick={() => inputRef.current?.click()}>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        ref={inputRef}
      />
      {src ? (
        <img
          src={src}
          alt="label"
          className="object-cover w-full"></img>
      ) : (
        <>
          <BiImageAdd size={36} className="text-gray-400" />
          <p className="text-sm text-gray-400">{label}</p>
        </>
      )}
    </button>
  );
}

function Input({
  name,
  label,
  placeholder,
  value,
  error,
  type = "text",
  onChange,
}: {
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  type?: string;
  error?: string;
}) {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex-1 flex gap-2">
        <h3>{label}</h3>
        <p className="p-1 bg-gray-100 text-gray-700 text-xs rounded">Wajib</p>
      </div>
      <div className="flex-[2]">
        <input
          value={value}
          name={name}
          className="border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded block w-full"
          type={type}
          placeholder={placeholder}
          onChange={onChange}
        />
        {error && <p className="text-red-600 text-sm pt-1">{error}</p>}
      </div>
    </div>
  );
}
