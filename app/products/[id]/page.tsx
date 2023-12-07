import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { FaAngleRight } from "react-icons/fa6";
import Link from "next/link";
import { MdEdit } from "react-icons/md";

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
  thumbnail: string;
  images: string[];
};

async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    id,
    thumbnail,
    title,
    description,
    rating,
    stock,
    price,
    discountPercentage,
    brand,
    category,
    images,
  } = await getProduct(params.id);

  return (
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
              images.map((src) => (
                <div className="flex-1 overflow-hidden">
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
            Rp{(price * (100 - discountPercentage) / 100).toLocaleString()}
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
          <div>
            <Link href={`/products/${id}/edit`} className="flex gap-2 items-center pl-4 pr-6 py-1 rounded bg-blue-100 text-blue-600 w-fit">
              <MdEdit />
              <p>Edit Product</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
