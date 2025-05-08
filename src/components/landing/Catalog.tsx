import SearchBar from "./SearchBar";
import ProductCard from "./ProductCard";
import db_store from "../../db_store";

export default function App({ ContainerStyles = "" }: { ContainerStyles?: string }) {
  return (
    <section id="catalog" className={`w-full flex flex-col justify-center items-center my-20 gap-10 px-3 sm:px-0 ${ContainerStyles}`}>
      <div className="w-full max-w-3xl flex flex-col gap-5 items-center">
        <div className="flex flex-col gap-2 items-center w-full">
        <p className="text-store text-4xl font-bold w-full">
          {db_store?.catalog?.title}
        </p>
        <p className="text-gray-400 font-semibold w-full">
          {db_store?.catalog?.sub_title}
        </p>
        </div>
      </div>
      <SearchBar />
      <ProductCard />
    </section>
  );
}
