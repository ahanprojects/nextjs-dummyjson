import { z } from "zod";

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
  thumbnail: z.string(),
  images: z.array(
    z.string()
  ),
});


const isImage = (fileName: string): boolean => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif"];
  const extension = fileName.split(".").pop()?.toLowerCase();
  return !!extension && imageExtensions.includes(extension);
};

export default ProductSchema