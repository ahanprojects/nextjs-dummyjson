'use client'

import addProduct from "./actions";
import { useFormState } from "react-dom";

export default function NewProductPage() {
  const [state, formAction] = useFormState(addProduct, {
    error: '',
    success: true,
  }) 
  const { error, success } = state
  return (
    <div className="p-8 flex justify-center">
      <form
        action={formAction}
        className="p-8 border border-gray-400 rounded-lg space-y-4">
        <h1 className="font-bold text-2xl pb-4 text-center">Add Product</h1>
        <Input label="Title" name="title" />
        <label className="block">Description
          <textarea
            name="description"
            className="border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded block w-full"
            placeholder="Description"
          />
        </label>
        <Input label="Brand" name="brand" />
        <Input label="Category" name="category" />
        <Input label="Price" name="price" type="number" />
        <Input label="Discount" name="discountPercentage" type="number" />
        <Input label="Rating" name="rating" type="number" />
        <Input label="Stock" name="stock" type="number" />
        { !success && <p className="text-red-500">{error}</p> }
        { success && <p className="text-blue-500">Add product success</p> }
        <div className="pt-4">
          <button
            type="submit"
            className="w-full px-3 py-2  bg-blue-600 rounded-md text-white font-medium">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({
  name,
  label,
  type = "text",
}: {
  name: string;
  label: string;
  type?: string;
}) {
  return (
    <label className="block">
      {label}
      <input
        name={name}
        className="border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded block w-full"
        type={type}
        placeholder={label}
      />
    </label>
  );
}
