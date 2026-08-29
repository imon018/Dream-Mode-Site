// সাম্প্রতিক দেখা প্রোডাক্ট (Recently Viewed) ট্র্যাক করার জন্য
// সাধারণ localStorage-ভিত্তিক হুক। লগইন ছাড়াই, প্রতিটা ডিভাইস/
// ব্রাউজারে আলাদাভাবে কাজ করবে — কোনো Firestore/Backend দরকার
// নেই বলে এক্সট্রা রিড/রাইট কস্ট ছাড়াই ব্যবহার করা যায়।

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { getProductById } from "../services/firestoreProductService";

const STORAGE_KEY = "dreamMode_recentlyViewed";
const MAX_ITEMS = 12;


function readFromStorage(){

  try{

    const raw =
      localStorage.getItem(STORAGE_KEY);

    if(!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];

  }catch(err){

    return [];

  }

}


function writeToStorage(items){

  try{

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    );

  }catch(err){
    // localStorage না থাকলে বা quota শেষ হয়ে গেলেও যেন পুরো
    // অ্যাপ ভেঙে না পড়ে, চুপচাপ ইগনোর করা হচ্ছে।
  }

}


// প্রোডাক্ট ডিটেইলস পেজে ভিজিট করার সাথে সাথে এটা কল করলেই
// লিস্টের একদম উপরে যোগ হয়ে যাবে (আগে থেকে থাকলে ডুপ্লিকেট না
// রেখে উপরে তুলে আনা হয়)। প্রয়োজনীয় কয়েকটা ফিল্ডই শুধু সেভ করা
// হচ্ছে যাতে localStorage অকারণে ভারী না হয়।

export function addRecentlyViewed(product){

  if(!product?.id) return;

  const existing =
    readFromStorage()
    .filter(
      (item) => item.id !== product.id
    );

  const entry = {

    id: product.id,
    name: product.name || "",

    image:
      product.image ||
      product.images?.[0] ||
      "",

    price: product.price ?? 0,
    offerPrice: product.offerPrice ?? 0,
    category: product.category || "",

    viewedAt: Date.now(),

  };

  const updated =
    [entry, ...existing]
    .slice(0, MAX_ITEMS);

  writeToStorage(updated);

}


export default function useRecentlyViewed(excludeId){

  const [items, setItems] = useState([]);


  useEffect(()=>{

    let cancelled = false;

    const all = readFromStorage();

    const visible =
      excludeId
      ?
      all.filter((item) => item.id !== excludeId)
      :
      all;

    // যতক্ষণ না DB-তে চেক করা হচ্ছে, ততক্ষণ সাথে সাথে যা
    // localStorage-এ আছে সেটাই দেখানো হচ্ছে (দ্রুত UI দেখানোর
    // জন্য) — এরপর ব্যাকগ্রাউন্ডে যাচাই করে ডিলিট হয়ে যাওয়া
    // প্রোডাক্টগুলো সরিয়ে ফেলা হবে।

    setItems(visible);


    // কোনো প্রোডাক্ট Admin থেকে ডিলিট করা হয়ে থাকলে localStorage-এ
    // পুরনো এন্ট্রি রয়ে যায় — সেগুলো ক্লিক করলে "Product Not
    // Found" দেখায়। তাই প্রতিবার এই সেকশন লোড হওয়ার সময় DB-তে
    // চেক করে দেখা হচ্ছে প্রোডাক্টগুলো এখনও আছে কিনা, না থাকলে
    // localStorage থেকেও স্থায়ীভাবে সরিয়ে ফেলা হচ্ছে।

    const pruneDeleted = async()=>{

      if(!visible.length) return;

      const results =
        await Promise.all(
          visible.map(
            async(item)=>{

              try{

                const product =
                  await getProductById(item.id);

                return product ? item : null;

              }catch(err){

                // নেটওয়ার্ক সমস্যা হলে আইটেমটা এখনই বাদ না দিয়ে
                // রেখে দেওয়া হচ্ছে, যাতে সাময়িক এরর-এ ভুলভাবে
                // মুছে না যায়।
                return item;

              }

            }
          )
        );

      const stillExisting =
        results.filter(Boolean);

      if(cancelled) return;

      if(stillExisting.length !== visible.length){

        setItems(stillExisting);

        // সম্পূর্ণ (excludeId ছাড়া) লিস্ট থেকেও ডিলিট হওয়া
        // আইডিগুলো বাদ দিয়ে localStorage আপডেট করা হচ্ছে।
        const stillExistingIds =
          new Set(
            stillExisting.map((item)=>item.id)
          );

        const prunedAll =
          all.filter(
            (item)=>
              stillExistingIds.has(item.id) ||
              item.id === excludeId
          );

        writeToStorage(prunedAll);

      }

    };

    pruneDeleted();

    return ()=>{
      cancelled = true;
    };

  },[excludeId]);


  const clearRecentlyViewed = useCallback(()=>{

    writeToStorage([]);
    setItems([]);

  },[]);


  return {
    recentlyViewed: items,
    clearRecentlyViewed,
  };

}
