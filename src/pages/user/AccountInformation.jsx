import useAuth from "../../hooks/useAuth";


export default function AccountInformation() {


  const { user } = useAuth();



  if(!user){

    return (

      <div className="text-center py-20">

        Please login first.

      </div>

    );

  }



  return (

    <div>


      <h1 className="text-3xl font-bold mb-8">

        Account Information

      </h1>



      <div className="bg-white rounded-3xl shadow p-8 space-y-5">


        <div>

          <h3 className="font-bold">

            User ID

          </h3>

          <p className="text-gray-600 break-all">

            {user.uid}

          </p>

        </div>




        <div>

          <h3 className="font-bold">

            Email

          </h3>

          <p className="text-gray-600">

            {user.email}

          </p>

        </div>




        <div>

          <h3 className="font-bold">

            Member Since

          </h3>

          <p className="text-gray-600">

            {
              user.metadata?.creationTime
              ?
              new Date(
                user.metadata.creationTime
              ).toLocaleDateString()
              :
              "N/A"
            }

          </p>

        </div>



      </div>


    </div>

  );

}
