// সাম্প্রতিক দেখা প্রোডাক্ট (Recently Viewed) ট্র্যাক করার জন্য
// সাধারণ localStorage-ভিত্তিক হুক। লগইন ছাড়াই, প্রতিটা ডিভাইস/
// ব্রাউজারে আলাদাভাবে কাজ করবে — কোনো Firestore/Backend দরকার
// নেই বলে এক্সট্রা রিড/রাইট কস্ট ছাড়াই ব্যবহার করা যায়।

import {
  useCallback,
  useEffect,
  useState,
} from "react";

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

    const all = readFromStorage();

    setItems(
      excludeId
      ?
      all.filter((item) => item.id !== excludeId)
      :
      all
    );

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
