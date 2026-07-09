import {
  Link,
  useNavigate,
} from "react-router-dom";


import useAuth from "../hooks/useAuth";

import useCart from "../hooks/useCart";


import {
  logout,
} from "../services/authService";



export default function Header() {


  const {
    user
  } = useAuth();



  const {
    cartCount
  } = useCart();




  const navigate =
    useNavigate();





  const handleLogout =
  async()=>{


    await logout();

    navigate("/login");


  };







  return (


    <header className="bg-white shadow">


      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">





        <Link

          to="/"

          className="text-2xl font-bold text-primary"

        >

          Dream Mode

        </Link>







        <nav className="flex gap-6 font-medium items-center">





          <Link to="/">
            Home
          </Link>





          <Link to="/shop">
            Shop
          </Link>





          <Link to="/cart">

            Cart ({cartCount})

          </Link>







          {!user ? (

            <>


              <Link to="/admin">

                Admin

              </Link>




              <Link to="/login">

                Login

              </Link>


            </>



          ) : user.role === "admin" ? (


            <>



              <Link to="/admin">

                Admin Dashboard

              </Link>





              <button

                onClick={handleLogout}

                className="text-red-600"

              >

                Logout

              </button>


            </>




          ) : (



            <>


              <Link to="/profile">

                Profile

              </Link>





              <button

                onClick={handleLogout}

                className="text-red-600"

              >

                Logout

              </button>


            </>



          )}



        </nav>



      </div>


    </header>


  );

}
