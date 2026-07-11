import { Link } from "react-router-dom";


export default function PolicyCTA(){


return (

<div
className="
mt-8
bg-white/10
backdrop-blur-xl
border
border-white/20
rounded-[30px]
p-6
text-center
"
>


<h3
className="
text-2xl
font-bold
text-white
"
>

Need Help?

</h3>



<p
className="
text-slate-300
mt-2
"
>

Our support team is ready to assist you.

</p>



<Link

to="/contact"

className="
inline-flex
mt-5
px-8
py-3
rounded-full
bg-amber-500
text-black
font-bold
hover:scale-105
transition
"

>

Contact Us

</Link>


</div>

);


}
