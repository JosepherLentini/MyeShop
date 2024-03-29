import NavbarLayout from "@/layouts/NavbarLayout";
import Head from "next/head";
//hooks
import { useEffect, useState } from "react";
import { Content } from "next/font/google";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import Router from "next/router";
// firebase
import { db, auth } from "@/firebase";
import { doc, setDoc, updateDoc, getDoc, collection } from "firebase/firestore";
//styles
import styles from "./ProductPage.module.scss";
//components
import LoggedMessage from "@/components/LoggedMessage/LoggedMessage";

const ProductPage = () => {
  const [cartList, setCartList] = useState([]);
  const [product, setProduct] = useState({});
  const [noLoggedMessage, setNoLoggedMessage] = useState(false);
  const [query, setQuery] = useState(null);
  const params = useParams();

  let router = useRouter();

  const addItemToDb = async (el) => {
    const user = auth.currentUser;
    if (user) {
      let uuid = localStorage.getItem("user");

      const docRef = doc(db, "cart", `${uuid}`);
      const docSnap = await getDoc(docRef);
      let ob;

      if (docSnap.exists()) {
        ob = docSnap.data().cart;

        let itemExist = ob.find((item) => item.id === el.id);
        if (itemExist) {
          let ab = ob.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          updateDoc(doc(db, "cart", `${uuid}`), {
            cart: [...ab],
          });
        } else {
          let ab;
          ab = [...ob, { ...product, quantity: 1 }];
          updateDoc(doc(db, "cart", `${uuid}`), {
            cart: [...ab],
          });
        }
      }
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      setNoLoggedMessage(true);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      fetch("https://fakestoreapi.com/products")
        .then((res) => res.json())
        .then((data) => {
          let prod = data.filter((ob) => ob.id == router.query.id);
          let prodObj = prod.pop();
          setProduct(prodObj);
        });
    }
  }, [router.isReady]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const addCart = async () => {
        let uuid = localStorage.getItem("user");
        const docRef = doc(db, "cart", `${uuid}`);
        const docSnap = await getDoc(docRef);
        let ob;

        if (docSnap.exists()) {
          let cL = docSnap.data().cart;
          setCartList(cL);
        }
      };
      addCart();
    }
  }, [cartList]);

  return (
    <>
      <Head>
        <title>MyeShop</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon-myeshop.ico" />
      </Head>
      <NavbarLayout cartList={cartList} setCartList={setCartList} />
      <div className={styles.ProductPage}>
        {noLoggedMessage && (
          <LoggedMessage setNoLoggedMessage={setNoLoggedMessage} />
        )}
        <div className={styles.ProductPage_wrapper}>
          <div className={styles.ProductPage_image}>
            <img src={product.image} alt={product.title} />
          </div>
          <div className={styles.ProductPage_text}>
            <h2>{product.title}</h2>
            <p className={styles.ProductPage_text_price}>${product.price}</p>
            <p className={styles.ProductPage_text_description}>
              {product.description}
            </p>
            <button onClick={() => addItemToDb(product)}>Add to cart</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
