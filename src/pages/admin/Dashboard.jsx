import {
  useEffect,
  useMemo,
  useState
} from "react";


import {
  getUsers
} from "../../services/adminService";


import {
  getProductsFromDB
} from "../../services/firestoreProductService";


import {
  getAllOrders
} from "../../services/orderService";


import MobileDashboard from "./components/MobileDashboard";

import DesktopDashboard from "./components/DesktopDashboard";

export default function Dashboard(){


const [loading,setLoading]=useState(true);


const [users,setUsers]=useState([]);

const [products,setProducts]=useState([]);

const [orders,setOrders]=useState([]);




useEffect(()=>{

loadDashboard();

},[]);

  

  

async function loadDashboard(){


try{


const [

usersData,

productsData,

ordersData


]=await Promise.all([


getUsers(),

getProductsFromDB(),

getAllOrders()


]);



setUsers(usersData);

setProducts(productsData);

setOrders(ordersData);



}

catch (error) {
    console.error(error);
  }

finally{

setLoading(false);

}


}






const stats = useMemo(()=>{


const admins =
users.filter(
user=>user.role==="admin"
).length;



const revenue =
orders
.filter(order=>order.status==="Delivered")
.reduce(
(sum,order)=>
sum + Number(order.total || 0),
0
);



return {


users:users.length,


admins,


products:products.length,


orders:orders.length,


revenue,


};


},[

users,

products,

orders

]);






if(loading){


return (

<div className="
min-h-screen
flex
items-center
justify-center
bg-warm
text-amber-600
font-semibold
">

Loading Dashboard...

</div>

);


}






const dashboardData={

users,

products,

orders,

stats

};





return (

<>

  
{/* MOBILE */}

<div className="lg:hidden">

<MobileDashboard

data={dashboardData}

/>

</div>






{/* DESKTOP */}

<div className="hidden lg:block">

<DesktopDashboard

data={dashboardData}

/>

</div>


  

</>

);


}
