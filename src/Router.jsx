import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import Login  from "./scenes/form/login/login";
import EmployeeForm from "./scenes/form/employee/EmployeeForm";
import PurchaseOrderForm from "./scenes/procurment/PurchaseOrders";
import PurchaseReceivedForm from "./scenes/procurment/PurchaseReceived";
import PurchaseInvoiceForm from "./scenes/procurment/PurchaseInvoice";
import GoodsReceivedForm from "./scenes/Inventory/GoodsReceived";
import GoodsIssueForm from "./scenes/Inventory/GoodsIssued";

import {
  Dashboard,
  Team,
  Invoices,
  Contacts,
  Form,
  Bar,
  Line,
  Pie,
  FAQ,
  Geography,
  Calendar,
  Stream,
  Employee,
  RequisitionForm,

} from "./scenes";


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Independent Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Main App Route with Nested Pages */}
          <Route path="/" element={<App />}>
          <Route path="/employee_Add" element={<EmployeeForm/>} />
          <Route index element={<Dashboard />} /> 
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="team" element={<Team />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="form" element={<Form />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="bar" element={<Bar />} />
          <Route path="pie" element={<Pie />} />
          <Route path="stream" element={<Stream />} />
          <Route path="line" element={<Line />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="geography" element={<Geography />} />
          <Route path="employee" element={<Employee />} />
          <Route path="/requsition" element={< RequisitionForm/>}/>
          <Route path="/purchase-order" element={< PurchaseOrderForm/>}/>
          <Route path="/purchase-received" element={< PurchaseReceivedForm/>}/>
          <Route path="/purchase-invoice" element={< PurchaseInvoiceForm/>}/>
          <Route path="/goods-received" element={< GoodsReceivedForm/>}/>
          <Route path="/goods-issue" element={< GoodsIssueForm/>}/>

        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
