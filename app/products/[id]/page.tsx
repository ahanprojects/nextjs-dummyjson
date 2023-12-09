"use client";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { FaAngleRight } from "react-icons/fa6";
import Link from "next/link";
import { MdDelete, MdEdit } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import Loader from "@/app/components/Loader";
import { Product } from "@/app/types/product";

export const dynamic = 'force-dynamic'

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    thumbnail = "",
    title = "",
    description = "",
    rating = "",
    stock = "",
    price = 0,
    discountPercentage = 0,
    brand = "",
    category = "",
    images = [],
  } = data || {};

  const dialogRef = useRef<HTMLDialogElement>(null);

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://dummyjson.com/products/${params.id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result: Product = await response.json();
        setData(result);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  async function handleDelete() {
    try {
      const response = await fetch(`https://dummyjson.com/products/${params.id}`, {
        method: 'DELETE',
      });
      router.push('/products')
    } catch (error) {
      console.error('Error:', error);
    } finally {
      dialogRef.current?.close()
    }
  }

  return (
    <>
      {/* Delete product dialog */}
      <dialog
        className="bg-white shadow-lg p-8 rounded-lg space-y-4"
        ref={dialogRef}>
        <h3 className="text-lg font-semibold">Hapus Produk</h3>
        <p className="pb-4">Anda yakin akan menghapus produk?</p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => {
              dialogRef.current?.close();
            }}>
            Batal
          </button>
          <button onClick={handleDelete}>OK</button>
        </div>
      </dialog>
      {loading ? (
        <div className="flex min-h-screen justify-center items-center">
          <Loader />
        </div>
      ) : (
        // Product page
        <div className="px-12 py-8 min-h-screen">
          <div className="flex gap-2 items-center text-sm pb-8 text-gray-800">
            <p>Home</p>
            <FaAngleRight size={10} />
            <p>{category}</p>
            <FaAngleRight size={10} />
            <p>{brand}</p>
            <FaAngleRight size={10} />
            <p>{title}</p>
          </div>
          <div className="flex gap-8 items-center">
            <div className="flex-1">
              <div className="flex-1 overflow-hidden pb-2">
                <img
                  src={thumbnail}
                  alt={title}
                  className="rounded-lg border border-gray-300 w-full aspect-square object-cover"
                />
              </div>
              <div className="flex gap-2">
                {images.length > 0 &&
                  images.map((src, i) => (
                    <div className="flex-1 overflow-hidden" key={i}>
                      <img
                        src={src}
                        alt={src}
                        className="rounded-md border border-gray-300 aspect-square object-cover"
                      />
                    </div>
                  ))}
              </div>
            </div>
            <div className="space-y-1 flex-[2]">
              <h1 className="font-semibold text-3xl pb-4">{title}</h1>
              <p>{description}</p>
              <div className="p-2 flex gap-2 items-center">
                <FaStar color={"orange"} size={20} />
                <p>{rating}</p>
                <GoDotFill size={10} className={"text-gray-400"} />
                <p>{stock} items available</p>
              </div>
              <h2 className="text-3xl font-semibold">
                Rp
                {((price * (100 - discountPercentage)) / 100).toLocaleString()}
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-red-600 p-1 bg-red-100 rounded text-xs">
                  {discountPercentage}%
                </p>
                <p className="line-through text-gray-400 text-sm">
                  Rp{price.toLocaleString()}
                </p>
              </div>
              <div className="grid grid-cols-2 w-fit gap-x-4 gap-y-1 py-8">
                <p className="font-semibold">Brand</p>
                <p>{brand}</p>
                <p className="font-semibold">Category</p>
                <p>{category}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/products/${params.id}/edit`}
                  className="flex gap-2 items-center pl-4 pr-6 py-1 rounded bg-blue-100 text-blue-600 w-fit">
                  <MdEdit />
                  <p>Ubah Produk</p>
                </Link>
                <button className="flex gap-2 items-center pl-4 pr-6 py-1 rounded bg-red-100 text-red-600 w-fit" onClick={() => { dialogRef.current?.showModal() }}>
                  <MdDelete />
                  <p>Hapus Produk</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
