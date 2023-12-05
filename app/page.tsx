import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/products");

  // return (
  //   <div className="flex flex-col justify-center items-center h-screen gap-4">
  //     <h1 className="text-4xl font-bold">Home Page</h1>
  //     <p>Redirecting to products...</p>
  //   </div>
  // );
}
