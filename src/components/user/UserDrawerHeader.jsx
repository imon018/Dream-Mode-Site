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





export default function UserDrawerHeader({

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





{/* TOP */}


<div

className="
flex
items-start
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

className="
w-11
h-11
object-contain
"

/>




<div>


<h2

className="
text-[20px]
font-bold
whitespace-nowrap
"

style={{

fontFamily:
"'Playfair Display', serif"

}}

>


{

settings.storeName ||

""

}


</h2>




<p

className="
text-xs
text-white/70
mt-1
"

>

User Panel

</p>


</div>


</div>







<button

onClick={closeDrawer}

>

<FiX size={30}/>

</button>



</div>









{/* USER INFO */}



<div

className="
mt-6
flex
items-center
justify-between
"

>




<div

className="
flex
items-center
gap-4
"

>



{


user?.photoURL

?

<img

src={user.photoURL}

className="
w-16
h-16
rounded-full
object-cover
border-4
border-white/30
"

/>


:


<div

className="
w-16
h-16
rounded-full
bg-blue-600
flex
items-center
justify-center
font-bold
text-xl
border-4
border-white/30
"

>

DM

</div>


}








<div>



<h3

className="
text-xl
font-bold
"

>

{

user?.name ||

user?.displayName ||

"User"

}

</h3>




<p

className="
text-sm
text-white/80
"

>

DM User

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
user?.lastLogin ||
user?.metadata?.lastSignInTime
)

}


</p>




</div>



</div>









{/* BELL */}


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


<FiBell size={26}/>




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
