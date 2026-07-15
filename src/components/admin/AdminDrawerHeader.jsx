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
  user
}=useAuth();



const {
  settings
}=useSettings();



const {
  unreadCount
}=useNotifications();






const formatDate = (time)=>{


  if(!time){

    return "No login data";

  }



  let date;



  if(time?.seconds){

    date = new Date(
      time.seconds * 1000
    );

  }

  else{

    date = new Date(time);

  }




  return date.toLocaleString(
    "en-GB",
    {
      day:"2-digit",
      month:"short",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
    }
  );


};








return (

<div

className="
bg-[#071F57]
text-white
px-6
py-5
"

>





{/* TOP HEADER */}


<div

className="
flex
items-start
justify-between
"

>





{/* LOGO */}


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
w-11
h-11
object-contain
"

/>





<div>



<h2

className="
text-[18px]
md:text-[20px]
font-bold
whitespace-nowrap
overflow-hidden
text-ellipsis
max-w-[160px]
leading-none
"

style={{

fontFamily:"'Playfair Display', serif"

}}

>

{

settings.storeName ||

"DM"

}

</h2>





<p

className="
text-xs
text-white/70
mt-1
"

>

Admin Panel

</p>



</div>



</div>








{/* CLOSE BUTTON */}



<button

onClick={closeDrawer}

>

<FiX

size={30}

/>

</button>





</div>









{/* ADMIN INFO */}



<div

className="
mt-6
flex
items-center
justify-between
"

>






{/* PROFILE */}



<div

className="
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
border-white/30
"

/>







<div>



<h3

className="
text-xl
font-bold
whitespace-nowrap
"

>

{

user?.name ||

user?.displayName ||

"DM"

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
leading-5
"

>

Last Login:

<br/>

{

formatDate(
user?.lastLogin
)

}


</p>



</div>



</div>









{/* NOTIFICATION BUTTON */}



<button

onClick={onNotificationClick}

className="
relative
w-10
h-10
rounded-xl
flex
items-center
justify-center
hover:bg-white/10
"

>

<FiBell

size={26}

/>




{

unreadCount > 0 &&


<span

className="
absolute
-top-1
-right-1
bg-red-500
text-white
text-[10px]
font-bold
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






</div>





</div>


);


}
