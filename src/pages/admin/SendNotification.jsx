import {
  useState,
  useEffect,
} from "react";


import {
  getUsers,
} from "../../services/adminService";


import {
  sendNotification,
  sendNotificationToAllUsers,
} from "../../services/notificationService";



export default function SendNotification() {


  const [users,setUsers] = useState([]);

  const [form,setForm] = useState({

    receiverId:"",
    title:"",
    message:"",
    type:"system",

  });


  const [sendToAll,setSendToAll] = useState(false);


  const [loading,setLoading] = useState(false);



  useEffect(()=>{


    async function loadUsers(){

      const data = await getUsers();

      setUsers(data);

    }


    loadUsers();


  },[]);






  const handleChange=(e)=>{


    setForm({

      ...form,

      [e.target.name]:e.target.value

    });


  };







  const handleSubmit=async(e)=>{


    e.preventDefault();


    setLoading(true);



    try{


      if(sendToAll){


  await sendNotificationToAllUsers(

    users,

    {

      title:form.title,

      message:form.message,

      type:form.type,

    }

  );


}else{


  await sendNotification({

    receiverId:
      form.receiverId,

    title:
      form.title,

    message:
      form.message,

    type:
      form.type,

  });


      }




      alert("Notification Sent Successfully");



      setForm({

        receiverId:"",
        title:"",
        message:"",
        type:"system",

      });



    }catch(error){


      console.log(error);

      alert(error.message);


    }finally{


      setLoading(false);


    }



  };







  return (


    <div className="max-w-3xl mx-auto p-6">


      <h1 className="text-2xl font-bold mb-6">

        Send Notification

      </h1>




      <form

        onSubmit={handleSubmit}

        className="
          bg-white
          p-6
          rounded-2xl
          shadow
          space-y-4
        "

      >



        <label className="flex gap-2">


          <input

            type="checkbox"

            checked={sendToAll}

            onChange={(e)=>setSendToAll(e.target.checked)}

          />


          Send To All Users


        </label>






        {!sendToAll && (


          <select

            name="receiverId"

            value={form.receiverId}

            onChange={handleChange}

            className="w-full border p-3 rounded-lg"

            required

          >


            <option value="">

              Select User

            </option>



            {
              users.map(user=>(


                <option

                  key={user.id}

                  value={user.id}

                >

                  {user.name} - {user.email}


                </option>


              ))
            }


          </select>


        )}







        <input

          name="title"

          value={form.title}

          onChange={handleChange}

          placeholder="Notification Title"

          className="w-full border p-3 rounded-lg"

          required

        />





        <textarea

          name="message"

          value={form.message}

          onChange={handleChange}

          placeholder="Notification Message"

          className="w-full border p-3 rounded-lg"

          rows="5"

          required

        />






        <select

          name="type"

          value={form.type}

          onChange={handleChange}

          className="w-full border p-3 rounded-lg"

        >

          <option value="system">
            System
          </option>

          <option value="order">
            Order
          </option>

          <option value="product">
            Product
          </option>

          <option value="offer">
            Offer
          </option>


        </select>







        <button

          disabled={loading}

          className="
            w-full
            bg-amber-500
            text-white
            py-3
            rounded-xl
          "

        >

          {
            loading
            ? "Sending..."
            : "Send Notification"
          }


        </button>



      </form>


    </div>


  );

}
