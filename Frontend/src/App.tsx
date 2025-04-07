import { Suspense, lazy,useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/header";
import Loader from "./components/admin/Loader";
import {Toaster}  from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { auth } from "./firebase";
import { getUser } from "./redux/api/userAPI";
import { RootState } from "./redux/store";
import ProtectedRoute from "./components/ProtectedRoute";



const Home = lazy(() => import("./pages/Home"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Search = lazy(() => import("./pages/Search"));
const Cart = lazy(() => import("./pages/Cart"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Login = lazy(() => import("./pages/Login"));
const Orders = lazy(() => import("./pages/Orders"));
const NotFound = lazy(() => import("./pages/not-found"));
const Checkout = lazy(()=>import("./pages/Checkout"))
const OrderDetails=lazy(()=>import ("./pages/OrderDetails"))




// Admin Routes Importing
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Products = lazy(() => import("./pages/admin/Products"));
const Customers = lazy(() => import("./pages/admin/Customers"));
const Transaction = lazy(() => import("./pages/admin/Transaction"));
const Discount = lazy(() => import("./pages/admin/Discount"));

const BarCharts = lazy(() => import("./pages/admin/charts/BarCharts"));
const PieCharts = lazy(() => import("./pages/admin/charts/PieCharts"));
const LineCharts = lazy(() => import("./pages/admin/charts/LineCharts"));
const Coupon = lazy(() => import("./pages/admin/apps/Coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/Stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/Toss"));
const NewProduct = lazy(() => import("./pages/admin/management/NewProduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/ProductManagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/TransactionManagement")
);
const DiscountManagement= lazy(
  () => import("./pages/admin/management/DiscountManagement")
);
const NewDiscount= lazy(
  () => import("./pages/admin/management/NewDiscount")
);


const App = () => {
  const { user, loading } = useSelector(
    (state: RootState) => state.userReducer
  );

  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUser(user.uid);
        dispatch(userExist(data.user));
      } else dispatch(userNotExist());
    });
  }, []);

  return loading ? <Loader/> :
  (
    <Router>
      
      <Header user={user}/>
     <Suspense fallback={<Loader/>}>
     
     <Routes>
    
  
             {/* Header */}
        <Route path="/" element={<Home/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/product/:id' element={<ProductDetails/>}/>


  
  
           {/* Not logged In Route */}
           <Route
            path="/login"
            element={
              <ProtectedRoute isAuthenticated={user ? false : true}>
                <Login />
              </ProtectedRoute>
            }
          />
          
          <Route
            element={<ProtectedRoute isAuthenticated={user ? true : false} />}
          >
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<OrderDetails />}/>
            <Route path="/pay" element={<Checkout />} /> 
          </Route>
  
  
            {/* Admin */}

            <Route
            element={
              <ProtectedRoute
                isAuthenticated={true}
                adminOnly={true}
                admin={user?.role === "admin" ? true : false}
              />
            }
          >
        <Route path='/admin/dashboard' element={ <Dashboard/> }/>
        <Route path='/admin/product' element={ <Products/> }/>
        <Route path='/admin/transaction' element={ <Transaction/> }/>
        <Route path='/admin/discount' element={ <Discount/> }/>
        <Route path='/admin/customer' element={ <Customers/> }/>
  
  
        {/* Charts */}
            <Route path="/admin/chart/bar" element={<BarCharts />} />
            <Route path="/admin/chart/pie" element={<PieCharts />} />
            <Route path="/admin/chart/line" element={<LineCharts />} />
  
        {/* Apps */}
  
  
        <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
            <Route path="/admin/app/coupon" element={<Coupon />} />
            <Route path="/admin/app/toss" element={<Toss />} />
  
        {/* ManageMent */}
        <Route path="/admin/product/new" element={<NewProduct />} />
            <Route path="/admin/product/:id" element={<ProductManagement />} />
            <Route
              path="/admin/transaction/:id"
              element={<TransactionManagement />}
            />
            <Route
              path="/admin/discount/new"
              element={<NewDiscount />}
            />
              <Route
              path="/admin/discount/:id"
              element={<DiscountManagement />}
            />
              </Route>

              <Route path="*" element={<NotFound/>}/>
     </Routes>
     </Suspense>
     <Toaster position="bottom-center"/>
    </Router>
    )
           }


export default App
