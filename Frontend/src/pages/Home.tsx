import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/Loader";
import ProductCard from "../components/ProductCard";
import { useLatestProductsQuery} from "../redux/api/productAPI";
import { useRecommendationsQuery} from "../redux/api/productAPI";
import { Slider } from "6pp";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem, Product } from "../types/types";
import toast from "react-hot-toast";
import videoCover from "../assets/videos/cover.mp4";
import { FaAnglesDown, FaHeadset } from "react-icons/fa6";
import { motion } from "framer-motion";
import { TbTruckDelivery } from "react-icons/tb";
import { LuShieldCheck } from "react-icons/lu";
import Footer from "../components/Footer";
import { RootState } from "../redux/store";
import FAQChatbot from "../components/FAQChatbot";

const clients = [
  {
    src: "https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg",
    alt: "react",
  },
  {
    src: "https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg",
    alt: "node",
  },
  {
    src: "https://www.vectorlogo.zone/logos/mongodb/mongodb-ar21.svg",
    alt: "mongodb",
  },
  {
    src: "https://www.vectorlogo.zone/logos/expressjs/expressjs-ar21.svg",
    alt: "express",
  },
  {
    src: "https://www.vectorlogo.zone/logos/js_redux/js_redux-ar21.svg",
    alt: "redux",
  },
  {
    src: "https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-ar21.svg",
    alt: "typescript",
  },
  {
    src: "https://www.vectorlogo.zone/logos/sass-lang/sass-lang-ar21.svg",
    alt: "sass",
  },
  {
    src: "https://www.vectorlogo.zone/logos/firebase/firebase-ar21.svg",
    alt: "firebase",
  },
  {
    src: "https://www.vectorlogo.zone/logos/figma/figma-ar21.svg",
    alt: "figma",
  },

  {
    src: "https://www.vectorlogo.zone/logos/github/github-ar21.svg",
    alt: "github",
  },

  {
    src: "https://www.vectorlogo.zone/logos/docker/docker-ar21.svg",
    alt: "Docker",
  },
  {
    src: "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-ar21.svg",
    alt: "Kubernetes",
  },
  {
    src: "https://www.vectorlogo.zone/logos/nestjs/nestjs-ar21.svg",
    alt: "Nest.js",
  },

  {
    src: "https://www.vectorlogo.zone/logos/graphql/graphql-ar21.svg",
    alt: "GraphQL",
  },

  {
    src: "https://www.vectorlogo.zone/logos/jestjsio/jestjsio-ar21.svg",
    alt: "Jest",
  },

  {
    src: "https://www.vectorlogo.zone/logos/redis/redis-ar21.svg",
    alt: "Redis",
  },

  {
    src: "https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21.svg",
    alt: "PostgreSQL",
  },
  {
    src: "https://www.vectorlogo.zone/logos/jenkins/jenkins-ar21.svg",
    alt: "Jenkins",
  },
];

const banners = [
  "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253445/rmbjpuzctjdbtt8hewaz.png",
  "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253433/ticeufjqvf6napjhdiee.png",
];

const categories = [
  "Electronics", "Mobiles", "Laptops", "Books", "Fashion",
  "Appliances", "Furniture", "Home Decor", "Grocery", "Beauty",
  "Toys", "Fitness",
];

const services = [
  {
    icon: <TbTruckDelivery />,
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $200",
  },
  {
    icon: <LuShieldCheck />,
    title: "SECURE PAYMENT",
    description: "100% secure payment",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 SUPPORT",
    description: "Get support 24/7",
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const {user}= useSelector((state: RootState) => state.userReducer)
  const { data, isError, isLoading } = useLatestProductsQuery("");

  const [lastProductId, setLastProductId] = useState<string | null>(null);

  // Get the last ordered product ID from backend
  useEffect(() => {
    const fetchLastProduct = async () => {
      try {
        const userId = user?._id ;
        if (!userId) return;

        const response = await fetch(
          `${import.meta.env.VITE_SERVER}/api/v1/order/my?id=${userId}`
        );
 
        const result = await response.json();
       
        if (result.success && result.orders.length > 0) {
          const latestOrder = result.orders[result.orders.length - 1];
          const lastProduct = latestOrder.orderItems?.[0].productId;
          
          if (lastProduct) setLastProductId(lastProduct);
        }
      } catch (err) {
        toast.error("Failed to fetch last order.");
      }
    };

    fetchLastProduct();
  },[user?._id]);

  // Fetch recommendations

  const {
    data: recommendedProducts,
    isError: isRecommendationsError,
    isLoading: isRecommendationsLoading,
  } = useRecommendationsQuery(lastProductId || "", { skip: !lastProductId });


  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  if (isError) toast.error("Cannot Fetch the Products");

  const coverMessage =
    "Fashion isn't just clothes; it's a vibrant language. Silhouettes and textures speak volumes..."
      .split(" ");

     

  return (
    <>
      <div className="home">
        <section></section>

        <div>
          <aside>
            <h1>Categories</h1>
            <ul>
              {categories.map((i) => (
                <li key={i}>
                  <Link to={`/search?category=${i.toLowerCase()}`}>{i}</Link>
                </li>
              ))}
            </ul>
          </aside>
          <Slider autoplay autoplayDuration={1500} showNav={false} images={banners} />
        </div>

        {/* Recommended Products Section */}
        {lastProductId && (
          <>
            <h1>Recommended for You</h1>
            <main>
              {isRecommendationsLoading ? (
                <Skeleton width="18.75rem" length={6} height="20rem" />
              ) : isRecommendationsError ? (
                <p>Could not fetch recommendations</p>
              ) : (
                
                recommendedProducts?.products?.map((i: Product)  => (
                  <ProductCard
                    key={i._id}
                    productId={i._id}
                    name={i.name}
                    price={i.price}
                    stock={i.stock}
                    handler={addToCartHandler}
                    photos={i.photos}
                  />
                ))
              )}
            </main>
          </>
        )}

        <h1>
          Latest Products
          <Link to="/search" className="findmore">More</Link>
        </h1>

        <main>
          {isLoading ? (
            Array.from({ length: 6 }, (_, i) => (
              <div key={i} style={{ height: "25rem" }}>
                <Skeleton width="18.75rem" length={1} height="20rem" />
                <Skeleton width="18.75rem" length={2} height="1.95rem" />
              </div>
            ))
          ) : (
            data?.products.map((i: Product) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler}
                photos={i.photos}
              />
            ))
          )}
        </main>
      </div>

      {/* Video + Clients + Services Sections */}
      <article className="cover-video-container">
        <div className="cover-video-overlay"></div>
        <video autoPlay loop muted src={videoCover} />
        <div className="cover-video-content">
          <motion.h2 initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            Fashion
          </motion.h2>
          {coverMessage.map((el, i) => (
            <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: i / 10 }}>
              {el}{" "}
            </motion.span>
          ))}
        </div>
        <motion.span animate={{ y: [0, 10, 0], transition: { duration: 1, repeat: Infinity } }}>
          <FaAnglesDown />
        </motion.span>
      </article>

      <article className="our-clients">
        <div>
          <h2>Our Clients</h2>
          <div>
            {clients.map((client, i) => (
              <motion.img
                key={i}
                src={client.src}
                alt={client.alt}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0, transition: { delay: i / 20, ease: "circIn" } }}
              />
            ))}
          </div>
          <motion.p initial={{ opacity: 0, y: -100 }} whileInView={{ opacity: 1, y: 0, transition: { delay: clients.length / 20 } }}>
            Trusted By 100+ Companies in 30+ countries
          </motion.p>
        </div>
      </article>

      <hr style={{ backgroundColor: "rgba(0,0,0,0.1)", border: "none", height: "1px" }} />

      <article className="our-services">
        <ul>
          {services.map((service, i) => (
            <motion.li
              key={service.title}
              initial={{ opacity: 0, y: -100 }}
              whileInView={{ opacity: 1, y: 0, transition: { delay: i / 20 } }}
            >
              <div>{service.icon}</div>
              <section>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </section>
            </motion.li>
          ))}
        </ul>
      </article>
      <Footer />
      <FAQChatbot/>
    </>
  );
};

export default Home;
