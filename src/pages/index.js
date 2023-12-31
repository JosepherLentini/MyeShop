import Head from "next/head";
import { Inter } from "next/font/google";
//hooks
import { useState, useEffect } from "react";
//components
import Products from "@/components/Products";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Info from "@/components/Info";
// layouts
import NavbarLayout from "@/layouts/NavbarLayout";
// firebase
import { db } from "@/firebase";
import { doc, getDoc, } from "firebase/firestore";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [cartList, setCartList] = useState([]);
  const [show, setShow] = useState(4);



  useEffect(() => {
    const addCart = async () => {
      let uuid = localStorage.getItem("user");
      const docRef = doc(db, "cart", `${uuid}`);
      const docSnap = await getDoc(docRef);
      let ob;
      
      if (docSnap.exists()) {
        let cL = docSnap.data().cart;
        setCartList(cL);
      } else {
        // console.log("No such document!");
      }
    };
    addCart()
  },[cartList]);



  return (
    <>
      <Head>
        <title>MyeShop</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon-myeshop.ico" />
      </Head>
      {/* <Navbar cartList={cartList} setCartList={setCartList} /> */}
      <NavbarLayout cartList={cartList} setCartList={setCartList} />
      <Hero />
      <Info />
      <Products
        data={data}
        setData={setData}
        items={items}
        setItems={setItems}
        cartList={cartList}
        setCartList={setCartList}
        show={show}
        setShow={setShow}
      />
    </>
  );
}
