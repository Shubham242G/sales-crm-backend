import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Dashboard from "../pages/DashboardPage/Dashboard";

import Layout from "./Layout";
import CustomerLedger from "../pages/LedgerPage/CustomerLedger";
import LedgerGroup from "../pages/MasterPages/LedgerGroup";
import SupplierGroup from "../pages/MasterPages/SupplierGroup";
import Category from "../pages/MasterPages/Category";
import SubCategory from "../pages/MasterPages/Sub_Category";
import BrandList from "../pages/MasterPages/BrandList";
import AllState from "../pages/MasterPages/AllState";
import AllCity from "../pages/MasterPages/AllCity";
import FeedbackList from "../pages/MasterPages/FeedbackList";
import HSNCode from "../pages/MasterPages/HSNCode";
import GSTSlab from "../pages/MasterPages/GSTSlab";
import OtherCharges from "../pages/MasterPages/OtherCharges";
import SectionAndFloor from "../pages/MasterPages/SectionAndFloor";
import PaymentMode from "../pages/MasterPages/PaymentMode";
import TranscationBook from "../pages/MasterPages/TransactionBook";
import Agent from "../pages/AgentPage/Agent";
import Transport from "../pages/TransportPage/Transport";
import DebitCreditNote from "../pages/DebitandCreditNote/DebitCreditNote";
import AddDebitCreditNote from "../pages/DebitandCreditNote/AddDebitCreditNote";
import EditDebitCreditNote from "../pages/DebitandCreditNote/EditDebitCreditNote";
import PaymentCollection from "../pages/PaymentCollection/PaymentCollection";
import EditPaymentCollection from "../pages/PaymentCollection/EditPaymentCollection";
import AddPaymentCollection from "../pages/PaymentCollection/AddPaymentCollection";
import Parcel from "../pages/Parcel/Parcel";
import Stock from "../pages/Stock/Stock";
import StockReportList from "../pages/Stock/StockReportList";
import UpdateProduct from "../pages/Stock/UpdateProduct";
import SalesLedger from "../pages/LedgerPage/SalesLedger";
import AddLedger from "../pages/LedgerPage/AddLedger";
// import UpdateLedger from '../pages/LedgerPage/UpdateLedger'
import Rfps from "../pages/LedgerPage/Rfps"
import QuotesForVendors from "../pages/LedgerPage/quotesForVendors"
import ConfirmedQuotes from "../pages/LedgerPage/confirmedQuotes"
import AddVendorForm from "../pages/LedgerPage/addVendor";
import ConfirmedQuotesView from "../pages/LedgerPage/confirmedQutesView";
import AddRfpsForm from "../pages/LedgerPage/addRfps";
import RfpsView from "../pages/LedgerPage/rfpsView";
import QuotesForVendorsView from "../pages/LedgerPage/quotesForVendorView";
import Leads from "../pages/Sales/leads";
import AddLeadsForm from "../pages/Sales/addLeads";
import CustomerSales from "../pages/Sales/customer";
import AddCustomer from "../pages/Sales/addCustomer";
import QuotesForCustomer from "../pages/Sales/quotesForCustomer";
import QuotesForCustomerView from "../pages/Sales/quotesForCustomerView";
import DailyActivityReport from "../pages/DailyActivityReport/DailyActivityProject";
import AddDailyActivityReport from "../pages/DailyActivityReport/addDailyActivityProject";
import TaskManagement from "../pages/TaskManagement/TaskManagement";
import AddTaskManagement from "../pages/TaskManagement/addTaskManagement";
import AddCategory from "../pages/Important/category";
import CategoryList from "../pages/Important/categoryList";
import HotelAdd from "../pages/Important/hotel";
import BanquetAdd from "../pages/Important/banquet";
import ResturantAdd from "../pages/Important/resturant";
import HotelList from "../pages/Important/hotelList";
export default function RoutesPage() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/all-ledger" element={<CustomerLedger />}></Route>
            <Route path="/rfps" element={<Rfps />}></Route>
            <Route path="/leads" element={<Leads />}></Route>
            <Route path="/category2" element={<AddCategory />}></Route>
            <Route path="/hotel" element={<HotelAdd />}></Route>
            <Route path="/hotel/:id" element={<HotelAdd />}></Route>
            <Route path="/banquet" element={<BanquetAdd />}></Route>
            <Route path="/resturant" element={<ResturantAdd />}></Route>
            <Route path="/category2/:id" element={<AddCategory />}></Route>
            <Route path="/CategoryList" element={<CategoryList />}></Route>
            <Route path="/hotelList" element={<HotelList />}></Route>
            <Route path="/quotesForCustomer" element={<QuotesForCustomer />}></Route>
            <Route path="/DailyActivityReport" element={<DailyActivityReport />}></Route> 
            <Route path="/TaskManagement" element={<TaskManagement />}></Route>
            <Route path="/add-TaskManagement" element={<AddTaskManagement />}></Route>
            <Route path="/add-DailyActivityReport" element={<AddDailyActivityReport />}></Route>
            <Route path="/customer-sales" element={<CustomerSales />}></Route>
            <Route path="/quotesForVendors" element={<QuotesForVendors />}></Route>
            <Route path="/confirmedQuotes" element={<ConfirmedQuotes />}></Route>
            <Route path="/ledger-group" element={<LedgerGroup />}></Route>
            <Route path="/view-quotesForVendor" element={<QuotesForVendorsView />}></Route>
            <Route path="/sales-ledger" element={<SalesLedger />}></Route>
            <Route path="/add-ledger" element={<AddLedger />}></Route>
            <Route path="/add-customer" element={<AddCustomer />}></Route>
            <Route path="/add-vendor" element={<AddVendorForm />}></Route>
            <Route path="/add-rfps" element={<AddRfpsForm />}></Route>
            <Route path="/add-leads" element={<AddLeadsForm />}></Route>
            <Route path="/view-rfps" element={<RfpsView />}></Route>
            <Route path="/view-rfps" element={<RfpsView />}></Route>
            <Route path="/view-quotesForCustomer" element={<QuotesForCustomerView />}></Route>
            <Route path="/ConfirmedQuotesView" element={<ConfirmedQuotesView />}></Route>
            <Route path="/update-ledger/:id" element={<AddLedger />}></Route>
            {/* <Route path="/update-ledger"  element={<UpdateLedger />}></Route> */}
            <Route path="/agent" element={<Agent />}></Route>
            <Route path="/transport" element={<Transport />}></Route>
            <Route
              path="/debit-credit-note"
              element={<DebitCreditNote />}
            ></Route>
            <Route
              path="/payment-collection"
              element={<PaymentCollection />}
            ></Route>
            <Route
              path="/edit-invoice-payment"
              element={<EditPaymentCollection />}
            ></Route>
            <Route
              path="/add-invoice-payment"
              element={<AddPaymentCollection />}
            ></Route>
            <Route path="/parcel" element={<Parcel />}></Route>
            <Route path="/all-product" element={<Stock />}></Route>
            <Route
              path="/stock-report-list"
              element={<StockReportList />}
            ></Route>
            <Route path="/update-product" element={<UpdateProduct />}></Route>
            <Route
              path="/add-credit-note"
              element={<AddDebitCreditNote />}
            ></Route>
            <Route
              path="/edit-credit-note"
              element={<EditDebitCreditNote />}
            ></Route>
            <Route path="/supplier-group" element={<SupplierGroup />}></Route>
            {/* <Route path="/category" element={<Category />}></Route> */}
            <Route path="/sub-category" element={<SubCategory />}></Route>
            <Route path="/brand-list" element={<BrandList />}></Route>
            <Route path="/all-state" element={<AllState />}></Route>
            <Route path="/all-city" element={<AllCity />}></Route>
            <Route path="/feedback-list" element={<FeedbackList />}></Route>
            <Route path="/hsncode" element={<HSNCode />}></Route>
            <Route path="/gst-slab" element={<GSTSlab />}></Route>
            <Route path="/other-charges" element={<OtherCharges />}></Route>
            <Route path="/godown-list" element={<SectionAndFloor />}></Route>
            <Route path="/payment-mode" element={<PaymentMode />}></Route>
            <Route
              path="/transaction-book"
              element={<TranscationBook />}
            ></Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}
