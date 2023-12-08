"use client";

import { z } from "zod";
import { ChangeEvent, useState, useEffect, useRef } from "react";
import addProduct from "./actions";
import { useFormState } from "react-dom";
import { BiImageAdd } from "react-icons/bi";

const isImage = (fileName: string): boolean => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif"];
  const extension = fileName.split(".").pop()?.toLowerCase();
  return !!extension && imageExtensions.includes(extension);
};

const ProductSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Nama produk tidak boleh kosong" }),
  description: z.string().min(1, { message: "Deskripsi tidak boleh kosong" }),
  price: z.number().positive({ message: "Harga harus berupa angka positif" }).min(100, { message: "Harga minimal 100" }),
  discountPercentage: z.number().min(0, {
    message: "Diskon harus antara 0 dan 100",
  }).max(100, {
    message: "Diskon harus antara 0 dan 100",
  }),
  rating: z.number().min(1, { message: "Rating harus antara 1 dan 5" }).max(5, { message: "Rating harus antara 1 dan 5" }),
  stock: z
    .number()
    .int()
    .min(1, { message: "Stok minimal 1 barang" }),
  brand: z.string().min(1, { message: "Merek tidak boleh kosong" }),
  category: z.string().min(1, { message: "Kategori tidak boleh kosong" }),
  thumbnail: z.string().refine((data) => isImage(data), {
    message: "Foto utama wajib diisi",
  }),
  images: z.array(
    z.string().refine((data) => isImage(data), {
      message: "Foto depan, samping, dan belakang wajib diisi",
    })
  ),
});

export default function NewProductPage() {
  const [state, formAction] = useFormState(addProduct, {
    error: "",
    success: true,
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discountPercentage: "",
    stock: "",
    brand: "",
    category: "",
    rating: "",
  });

  const [categories, setCategories] = useState([]);

  const [img1, setImg1] = useState<File | null>(null);
  const [img2, setImg2] = useState<File | null>(null);
  const [img3, setImg3] = useState<File | null>(null);
  const [img4, setImg4] = useState<File | null>(null);

  const [errors, setErrors] = useState({
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
  });

  const dialogRef = useRef<HTMLDialogElement>(null);

  // Get categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("https://dummyjson.com/products" + "/categories");
      const categoriesData = await res.json();
      setCategories(categoriesData);
    };
    fetchCategories();
  }, []);

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    console.log({ name, value });
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  }

  function handleSubmit() {
    // Convert strings into numbers, add images
    const data = {
      ...formData,
      price: formData.price.length == 0 ? -1 : Number(formData.price),
      discountPercentage: formData.discountPercentage.length == 0 ? -1 : Number(formData.discountPercentage),
      rating: formData.rating.length == 0 ? -1 : Number(formData.rating),
      stock: formData.stock.length == 0 ? -1 : Number(formData.stock),
      thumbnail: img1?.name,
      images: [img2?.name, img3?.name, img4?.name],
    };

    console.log('DATA ')
    console.log(data)

    const validation = ProductSchema.safeParse(data);

    if (!validation.success) {
      const newErrors: any = {};
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
    setErrors({} as any)

    // Submit
    dialogRef.current?.showModal();
  }

  function submitForm() {
    console.log('submit')
  }

  return (
    <>
      {/* Dialog */}
      <dialog
        className="bg-white shadow-lg p-8 rounded-lg space-y-4"
        ref={dialogRef}>
        <h3 className="text-lg font-semibold">Tambah Produk</h3>
        <p className="pb-4">Anda yakin akan menambah produk?</p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => {
              dialogRef.current?.close();
            }}>
            Batal
          </button>
          <button onClick={submitForm}>OK</button>
        </div>
      </dialog>
      {/* Form */}
      <form className="py-8 px-12 space-y-8">
        <h1 className="py-3 text-2xl font-bold">Tambah Produk</h1>
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
                file={img1}
                onFileSelect={(file) => setImg1(file)}
              />
              <ImageUploader
                label="Depan"
                file={img2}
                onFileSelect={(file) => setImg2(file)}
              />
              <ImageUploader
                label="Samping"
                file={img3}
                onFileSelect={(file) => setImg3(file)}
              />
              <ImageUploader
                label="Belakang"
                file={img4}
                onFileSelect={(file) => setImg4(file)}
              />
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
          <button className="px-8 py-2 font-semibold rounded-lg">
            Kembali
          </button>
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
  file,
  onFileSelect,
}: {
  label: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    onFileSelect(file || null);
  };

  return (
    <button
      className="flex-1 border border-dashed border-gray-400 rounded-lg aspect-square p-8 flex flex-col justify-center items-center gap-2 overflow-hidden"
      onClick={() => inputRef.current?.click()}>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        ref={inputRef}
      />
      {file ? (
        <img
          src={URL.createObjectURL(file)}
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
