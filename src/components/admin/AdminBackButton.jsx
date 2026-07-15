import {
 FiArrowLeft
} from "react-icons/fi";

import {
 useNavigate
} from "react-router-dom";


export default function AdminBackButton(){

const navigate = useNavigate();


return (

<button

onClick={()=>navigate(-1)}

className="
mb-4
flex
items-center
gap-2
text-[#071F57]
font-medium
hover:opacity-70
"

>

<FiArrowLeft size={22}/>

Back

</button>

);

}
