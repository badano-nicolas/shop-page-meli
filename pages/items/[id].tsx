import Head from "next/head";
import Image from "next/image";
import { SearchItem } from "../../actions/searchActions";
import Breadcrumb from "../../components/Breadcrumb";
import Header from "../../components/Header";
import PriceInfo from "../../components/PriceInfo";

export default function ItemsDetail({ data }: any) {
  const item = data.item;
  const itemCondition = {
    new: "Nuevo",
    used: "Usado",
  };
  return (
    <div className="">
      <Head>
        <title>Shop app Meli</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-white-meli text-dark-meli min-h-screen">
        <Header />
        <Breadcrumb categories={item.categories} />
        <div className="container mx-auto bg-white mb-6 mt-3 rounded-sm p-8">
          <div className="flex flex-col md:flex-row border-b pb-6 md:border-b-0 md:pb-0">
            <div className="md:w-1/2">
              <Image
                src={item.picture}
                alt={item.title}
                width={680}
                height={680}
                className="rounded"
              ></Image>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-normal">
                {item.condition === "new" ? "Nuevo " : "Usado "} -{" "}
                {item.sold_quantity} vendidos
              </span>
              <h1 className="text-2xl font-semibold mt-4">{item.title}</h1>
              <div className="text-[46px] mt-8">
                <PriceInfo price={item.price} />
              </div>
              <button
                type="button"
                className="bg-blue-meli  text-white py-2 mt-8 rounded mr-8"
              >
                Comprar
              </button>
            </div>
          </div>
          <div>
            <h4 className="text-[28px] mt-6 font-semibold">
              Descripción del producto
            </h4>
            <p className="mt-8 text-base text-gray-meli whitespace-pre-line">
              {item.description}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(con: any) {
  const itemId = con.query.id;
  const data = await getItemDataById(itemId);
  const descriptionData = await getItemDescriptionById(itemId);

  const {
    id,
    title,
    price,
    pictures,
    condition,
    shipping: { free_shipping },
    sold_quantity,
    currency_id,
  } = data;

  const { plain_text } = descriptionData;

  const parsedData: SearchItem = {
    author: {
      name: "Nicolas",
      lastname: "Badano",
    },
    item: {
      id: id,
      title: title,
      price: {
        currency: currency_id,
        amount: price,
        decimals: 0,
      },
      picture: pictures[0].url,
      condition: condition,
      free_shipping: free_shipping,
      sold_quantity: sold_quantity,
      description: plain_text,
    },
  };

  return { props: { data: parsedData } };
}

const baseURL: string = "https://api.mercadolibre.com";

const getItemDataById = async (id: string) => {
  const res = await fetch(baseURL + "/items/" + id);
  const data = await res.json();
  return data;
};

const getItemDescriptionById = async (id: string) => {
  const res = await fetch(baseURL + "/items/" + id + "/description");
  const data = await res.json();
  return data;
};
