import {
  Outlet,
} from "react-router-dom";

import AdminBackButton from "../components/admin/AdminBackButton";


export default function AdminLayout(){

  return (

    <div
      className="
      min-h-screen
      bg-[#F8F5EF]
      "
    >

      <main
        className="
        p-4
        lg:p-8
        "
      >

        <div className="
relative
">

<AdminBackButton />


<Outlet />

</div>

      </main>

    </div>

  );

}
