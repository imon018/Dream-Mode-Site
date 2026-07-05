import Button from "../ui/Button";
import { deleteProduct } from "../../services/productService";

export default function ProductTable({ products }) {
  return (
    <div className="overflow-x-auto">

      <table className="w-full border">

        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {products.map((p) => (
            <tr key={p.id} className="border-t">

              <td className="p-3">{p.name}</td>

              <td>৳ {p.price}</td>

              <td>

                <Button
                  onClick={() => deleteProduct(p.id)}
                  className="bg-red-500"
                >
                  Delete
                </Button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}
