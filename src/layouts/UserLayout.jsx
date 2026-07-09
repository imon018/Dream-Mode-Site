import { useState } from "react";

import {
  Outlet,
  NavLink,
} from "react-router-dom";

import {
  FiUser,
  FiActivity,
  FiShoppingBag,
  FiHeart,
  FiLock,
  FiTrash2,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

import {
  logout,
} from "../services/authService";


export default function UserLayout() {


  const [sidebarOpen,setSidebarOpen] =
    useState(false);


  const menu = [

  {
    name:"Account Information",
    path:"/profile/account",
    icon:<FiUser />,
  },

  {
    name:"Recent Activities",
    path:"/profile/activity",
    icon:<FiActivity />,
  },

  {
    name:"My Orders",
    path:"/profile/orders",
    icon:<FiShoppingBag />,
  },

  {
    name:"Wishlist",
    path:"/profile/wishlist",
    icon:<FiHeart />,
  },

  {
    name:"Change Password",
    path:"/profile/security/password",
    icon:<FiLock />,
  },

  {
    name:"Delete Account",
    path:"/profile/security/delete",
    icon:<FiTrash2 />,
  },

];


  return (

    <div className="min-h-screen bg-gray-100 flex">


      {/* Mobile Menu Button */}

      <button

        onClick={()=>
          setSidebarOpen(true)
        }

        className="
        lg:hidden
        fixed
        top-4
        left-4
        z-50
        bg-slate-900
        text-white
        p-3
        rounded-xl
        "

      >

        <FiMenu size={22}/>

      </button>





      {
        sidebarOpen && (

          <div

            onClick={()=>
              setSidebarOpen(false)
            }

            className="
            fixed
            inset-0
            bg-black/50
            z-40
            lg:hidden
            "

          />

        )
      }





      {/* Sidebar */}


      <aside

        className={`
        
        fixed
        lg:static
        top-0
        left-0
        h-screen
        w-72
        bg-slate-900
        text-white
        z-50
        transform
        transition
        duration-300

        ${
          sidebarOpen
          ?
          "translate-x-0"
          :
          "-translate-x-full lg:translate-x-0"
        }

        `}

      >



        <div className="lg:hidden flex justify-end p-4">


          <button

            onClick={()=>
              setSidebarOpen(false)
            }

          >

            <FiX size={26}/>

          </button>


        </div>





        <div className="p-6 border-b border-slate-700">


          <h1 className="text-2xl font-bold">

            Dream Mode

          </h1>


          <p className="text-gray-400 text-sm">

            My Account

          </p>


        </div>






        <nav className="p-4 space-y-2">


          {
            menu.map((item)=>(


              <NavLink

                key={item.path}

                to={item.path}

                className={({isActive})=>

                `
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                transition

                ${
                  isActive
                  ?
                  "bg-blue-600"
                  :
                  "hover:bg-slate-800"
                }

                `

                }

              >


                {item.icon}


                {item.name}


              </NavLink>


            ))
          }


        </nav>






        <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">


          <button

            onClick={logout}

            className="
            w-full
            flex
            justify-center
            items-center
            gap-2
            bg-red-600
            py-3
            rounded-xl
            "

          >

            <FiLogOut/>

            Logout


          </button>


        </div>




      </aside>







      {/* Main Content */}


      <main className="
      flex-1
      p-8
      ">


        <Outlet/>


      </main>



    </div>


  );

}
