import { useState } from "react";

import {
  addOrderByAdmin,
} from "../../services/orderService";

import {
  successToast,
  errorToast,
} from "../../components/ui/Toast";

import Button from "../../components/ui/Button";



export default function AddOrder(){


  const [customerName,setCustomerName] =
    useState("");

  const [email,setEmail] =
    useState("");

  const [phone,setPhone] =
    useState("");

  const [address,setAddress] =
    useState("");

  const [productName,setProductName] =
    useState("");

  const [price,setPrice] =
    useState("");

  const [quantity,setQuantity] =
    useState(1);




  const handleSubmit = async(e)=>{

    e.preventDefault();


    if(
      !customerName ||
      !email ||
      !phone ||
      !address ||
      !productName ||
      !price
    ){

      errorToast(
        "Please fill all fields."
      );

      return;

    }


    try{


      await addOrderByAdmin({

        customerName,

        email,

        phone,

        address,


        items:[

          {
            id:Date.now(),

            name:productName,

            price:Number(price),

            quantity:Number(quantity),

          }

        ],


        total:
          Number(price) *
          Number(quantity),


        status:
          "Pending",


        createdAt:
          new Date()
          .toISOString(),


      });



      successToast(
        "Order added successfully."
      );


      setCustomerName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setProductName("");
      setPrice("");
      setQuantity(1);



    }catch(error){


      console.log(error);


      errorToast(
        error.message
      );


    }


  };



  return (

    <div className="max-w-xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">

        Add Order

      </h1>


      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-8 rounded-3xl shadow"
      >


        <input
          className="w-full border rounded-xl p-3"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e)=>
            setCustomerName(e.target.value)
          }
        />



        <input
          className="w-full border rounded-xl p-3"
          placeholder="Email"
          value={email}
          onChange={(e)=>
            setEmail(e.target.value)
          }
        />

                <input
          className="w-full border rounded-xl p-3"
          placeholder="Phone"
          value={phone}
          onChange={(e)=>
            setPhone(e.target.value)
          }
        />


        <textarea
          className="w-full border rounded-xl p-3"
          placeholder="Address"
          rows="3"
          value={address}
          onChange={(e)=>
            setAddress(e.target.value)
          }
        />


        <input
          className="w-full border rounded-xl p-3"
          placeholder="Product Name"
          value={productName}
          onChange={(e)=>
            setProductName(e.target.value)
          }
        />


        <input
          type="number"
          className="w-full border rounded-xl p-3"
          placeholder="Price"
          value={price}
          onChange={(e)=>
            setPrice(e.target.value)
          }
        />


        <input
          type="number"
          className="w-full border rounded-xl p-3"
          placeholder="Quantity"
          value={quantity}
          onChange={(e)=>
            setQuantity(e.target.value)
          }
        />


        <Button
          type="submit"
          className="w-full mt-4"
        >

          Add Order

        </Button>
