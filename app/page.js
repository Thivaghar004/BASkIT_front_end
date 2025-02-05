import { Button } from "@/components/ui/button";
import Image from "next/image";
import Slider from "./_components/Sliders";
import CategoryList from "./_components/CategoryList";
import ProductList from "./_components/ProductList";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div>
      <Slider/>
      <CategoryList/>
      <ProductList/>
      <Footer/>
    </div>
  );
}
