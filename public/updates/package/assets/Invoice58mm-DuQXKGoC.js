import{r as i,j as e,F as h,a as m,c as o,g as p}from"./index-B7yVKgyC.js";import{Q as j}from"./browser-CpybE61s.js";if(typeof document<"u"&&!document.getElementById("dm-thankyou-font")){const s=document.createElement("link");s.id="dm-thankyou-font",s.rel="stylesheet",s.href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap",document.head.appendChild(s)}function u({order:s}){const[a,c]=i.useState({storeName:"",logoUrl:"",phone:"",facebook:"",websiteUrl:""}),[l,x]=i.useState("");return i.useEffect(()=>{async function t(){const n=await p();c(n||{});const d=n?.websiteUrl||n?.facebook||window.location.origin,r=await j.toDataURL(d);x(r)}t()},[]),s?e.jsxs("div",{id:"invoice58mm",className:`
      bg-white
      mx-auto
      text-black
      p-2
      `,style:{width:"58mm",minWidth:"58mm",maxWidth:"58mm",fontSize:"11px",lineHeight:1.4},children:[e.jsxs("div",{className:"flex items-center justify-center gap-1.5",children:[a.logoUrl&&e.jsx("img",{src:a.logoUrl,alt:a.storeName,className:"w-11 h-11 object-contain shrink-0"}),e.jsxs("div",{className:"text-left min-w-0 flex-1",children:[e.jsx("h1",{className:`
            text-[17px]
            font-black
            tracking-wide
            uppercase
            leading-tight
            whitespace-nowrap
            `,children:a.storeName}),e.jsx("p",{className:`
            text-[8px]
            text-gray-600
            whitespace-nowrap
            overflow-hidden
            text-ellipsis
            `,children:"Dress Your Dream, Live Your Style"})]})]}),e.jsx("div",{className:"my-1.5 flex justify-center",children:e.jsx("div",{className:`
          bg-black
          text-white
          px-4
          py-0.5
          text-[11px]
          font-bold
          tracking-wide
          `,children:"INVOICE / MEMO"})}),e.jsxs("div",{className:"space-y-1 text-[11px]",children:[e.jsxs("div",{className:"flex justify-between gap-2",children:[e.jsx("span",{children:"Invoice No"}),e.jsxs("span",{children:["DM-",String(s.id||"").slice(0,8).toUpperCase()]})]}),e.jsxs("div",{className:"flex justify-between gap-2",children:[e.jsx("span",{children:"Date"}),e.jsx("span",{children:new Date(s.createdAt).toLocaleString()})]}),e.jsxs("div",{className:"flex justify-between gap-2",children:[e.jsx("span",{children:"Status"}),e.jsx("span",{className:`
            px-2
            rounded-full
            text-white
            text-[10px]
            bg-green-500
            `,children:"Confirmed"})]}),e.jsxs("div",{className:"flex justify-between gap-2",children:[e.jsx("span",{children:"Payment Method"}),e.jsx("span",{children:s.paymentMethod||"Cash On Delivery"})]}),e.jsxs("div",{className:"flex justify-between gap-2",children:[e.jsx("span",{children:"Payment Status"}),e.jsx("span",{className:`
            px-2
            rounded-full
            text-white
            text-[10px]
            ${s.paymentStatus==="Paid"?"bg-green-500":"bg-yellow-500"}
            `,children:s.paymentStatus||"Pending"})]})]}),e.jsx("hr",{className:"my-1.5"}),e.jsx("h2",{className:"font-bold mb-1",children:"Customer"}),e.jsxs("div",{className:"space-y-1 text-[11px]",children:[e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx(h,{size:13}),e.jsx("span",{children:s.customerName})]}),e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx(m,{size:13}),e.jsx("span",{children:s.phone})]}),e.jsxs("div",{className:"flex gap-2 items-start",children:[e.jsx(o,{size:13,className:"mt-0.5"}),e.jsxs("span",{children:[s.address,s.thana?`, ${s.thana}`:"",s.district?`, ${s.district}`:""]})]})]}),e.jsx("hr",{className:"my-1.5"}),e.jsx("h2",{className:"font-bold mb-1",children:"Products"}),e.jsxs("table",{className:"w-full text-[10px]",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b",children:[e.jsx("th",{className:"text-left py-1",children:"Item"}),e.jsx("th",{className:"text-center py-1",children:"Qty"}),e.jsx("th",{className:"text-right py-1",children:"Price"})]})}),e.jsx("tbody",{children:s.items?.map((t,n)=>e.jsxs("tr",{className:"border-b",children:[e.jsxs("td",{className:"py-1",children:[e.jsx("div",{className:"font-semibold",children:t.name}),(t.size||t.color)&&e.jsxs("div",{className:"text-[9px] text-gray-500",children:[t.size||"-",t.color?` / ${t.color}`:""]})]}),e.jsx("td",{className:"text-center",children:t.quantity}),e.jsxs("td",{className:"text-right",children:["৳",(t.offerPrice||t.price||0)*t.quantity]})]},t.id||n))})]}),e.jsx("hr",{className:"my-1.5"}),e.jsxs("div",{className:"space-y-1 text-[11px]",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"Subtotal"}),e.jsxs("span",{children:["৳ ",s.subtotal||s.total]})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"Delivery"}),e.jsxs("span",{children:["৳ ",s.deliveryCharge||0]})]}),(s.discount||0)>0&&e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"Discount"}),e.jsxs("span",{children:["- ৳ ",s.discount]})]})]}),e.jsx("hr",{className:"my-1.5"}),e.jsxs("div",{className:"flex justify-between font-black text-[14px]",children:[e.jsx("span",{children:"TOTAL"}),e.jsxs("span",{children:["৳ ",s.total]})]}),e.jsx("hr",{className:"my-1.5"}),e.jsxs("div",{className:"text-center text-[10px] space-y-0.5",children:[a.phone&&e.jsxs("p",{children:["Contact Us: ",a.phone]}),a.facebook&&e.jsx("p",{className:"break-all",children:a.facebook})]}),e.jsxs("div",{className:"flex items-center justify-between mt-2",children:[e.jsxs("div",{children:[e.jsxs("p",{className:"text-[16px]",style:{fontFamily:"'Dancing Script', cursive"},children:["Thank You! ",e.jsx("span",{className:"text-pink-500",children:"♥"})]}),e.jsxs("p",{className:"text-[9px] text-gray-600",children:["for shopping with ",a.storeName||"Dream Mode"]})]}),l&&e.jsx("img",{src:l,alt:"QR",className:"w-14 h-14"})]})]}):null}export{u as default};
