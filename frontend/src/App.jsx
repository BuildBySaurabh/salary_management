import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EmployeeDetail from "./pages/EmployeeDetail";
import SalarySheets from "./pages/SalarySheets";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

export default function App() {
  return <Routes>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route element={<ProtectedRoute/>}>
      <Route element={<AppLayout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path="/employees" element={<Employees/>}/>
        <Route path="/employees/new" element={<AddEmployee/>}/>
        <Route path="/employees/:id" element={<EmployeeDetail/>}/>
        <Route path="/employees/:id/edit" element={<EmployeeDetail edit/>}/>
        <Route path="/salary-sheets" element={<SalarySheets/>}/>
        <Route path="/reports" element={<Reports/>}/>
        <Route path="/settings" element={<Settings/>}/>
      </Route>
    </Route>
    <Route path="*" element={<Login/>}/>
  </Routes>;
}
