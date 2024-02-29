import { Item } from "../types";

const ItemCard = ({ items }: { items: Item[] }) => {
  return (
    <div className="p-4">
      <ul className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lgl:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-4 border border-drim_dark shadow-md p-3 rounded-lg"
          >
            <p className="text-2xl font-semibold">{item.product}</p>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">ID:</span> {item.id}
              </p>
              <p className="font-semibold">
                <span className="font-semibold">Price:</span> {item.price} ₽
              </p>
              <p>
                <span className="font-semibold">brand:</span>{" "}
                {item.brand ? item.brand : "N/A"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemCard;
