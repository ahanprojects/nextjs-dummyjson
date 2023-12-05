import editProduct from "./actions";

async function getProduct(id: number) {
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function EditProductPage({ params }: any) {
  const {title, description, price, discountPercentage, rating, stock, brand, category} = await getProduct(params.id)

  return (
    <div className="p-8 flex justify-center">
      <form
        action={editProduct.bind(null, Number(params.id))}
        className="p-8 border border-gray-400 rounded-lg space-y-4">
        <h1 className="font-bold text-2xl pb-4 text-center">Edit Product</h1>
        <Input label="Title" name="title" defaultValue={title}/>
        <label className="block">Description
          <textarea
            name="description"
            defaultValue={description}
            className="border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded block w-full"
            placeholder="Description"
          />
        </label>
        <Input label="Brand" name="brand"  defaultValue={brand}/>
        <Input label="Category" name="category"  defaultValue={category}/>
        <Input label="Price" name="price" type="number"  defaultValue={price}/>
        <Input label="Discount" name="discountPercentage" type="number"  defaultValue={discountPercentage}/>
        <Input label="Rating" name="rating" type="number"  defaultValue={rating}/>
        <Input label="Stock" name="stock" type="number"  defaultValue={stock}/>
        <div className="pt-4">
          <button
            type="submit"
            className="w-full px-3 py-2  bg-blue-600 rounded-md text-white font-medium">
            Edit Product
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
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue: string
}) {
  return (
    <label className="block">
      {label}
      <input
        name={name}
        defaultValue={defaultValue}
        className="border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded block w-full"
        type={type}
        placeholder={label}
      />
    </label>
  );
}
