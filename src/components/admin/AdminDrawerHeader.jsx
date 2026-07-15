import {
  FiX,
  FiBell,
} from "react-icons/fi";


import useAuth from "../../hooks/useAuth";

import {
  useSettings,
} from "../../context/SettingsContext";

import {
  useNotifications,
} from "../../context/NotificationContext";


export default function AdminDrawerHeader({
  closeDrawer,
  onNotificationClick,
}) {


  const {
    user,
  } = useAuth();



  const {
    settings,
  } = useSettings();



  const {
    unreadCount,
  } = useNotifications();





  const formatLastLogin = () => {

    if(!user?.lastLogin){

      return "No login data";

    }


    if(user.lastLogin?.seconds){

      return new Date(
        user.lastLogin.seconds * 1000
      ).toLocaleString();

    }


    return "Recently";


  };






  return (


    <div
      className="
      bg-[#071F57]
      text-white
      p-6
      "
    >


      {/* TOP */}

      <div
        className="
        flex
        items-center
        justify-between
        "
      >



        <div
          className="
          flex
          items-center
          gap-3
          "
        >

          <img

            src={
              settings.logoUrl ||
              "/logo.png"
            }

            alt="logo"

            className="
            w-10
            h-10
            object-contain
            "

          />


          <div>

            <h2
              className="
              text-xl
              font-bold
              "
            >

              {
                settings.storeName ||
                "Dream Mode"
              }

            </h2>


            <p
              className="
              text-xs
              text-white/70
              "
            >

              Admin Panel

            </p>


          </div>


        </div>





        <div
          className="
          flex
          items-center
          gap-3
          "
        >


          {/* BELL */}

          <button

            onClick={onNotificationClick}

            className="
            relative
            "

          >

            <FiBell size={24}/>



            {
              unreadCount > 0 &&

              <span

                className="
                absolute
                -top-2
                -right-2
                bg-red-500
                text-white
                text-[10px]
                w-5
                h-5
                rounded-full
                flex
                items-center
                justify-center
                "
              >

                {
                  unreadCount > 99
                  ?
                  "99+"
                  :
                  unreadCount
                }


              </span>

            }


          </button>





          {/* CLOSE */}

          <button

            onClick={closeDrawer}

          >

            <FiX size={28}/>

          </button>



        </div>



      </div>








      {/* ADMIN INFO */}


      <div

        className="
        mt-6
        flex
        items-center
        gap-4
        "

      >


        <img

          src={
            user?.photoURL ||
            "https://ui-avatars.com/api/?name=Admin"
          }

          alt="admin"

          className="
          w-16
          h-16
          rounded-full
          object-cover
          border-4
          border-yellow-400
          "

        />





        <div>


          <h3

            className="
            font-bold
            text-lg
            "

          >

            {
              user?.name ||
              "Admin Name"
            }


          </h3>



          <p

            className="
            text-sm
            text-white/80
            "

          >

            Administrator

          </p>




          <p

            className="
            text-xs
            text-white/60
            mt-1
            "

          >

            Last Login:
            <br/>

            {formatLastLogin()}


          </p>



        </div>


      </div>



    </div>


  );


}
