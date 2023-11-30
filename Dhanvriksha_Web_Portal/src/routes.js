import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
import NotFound from "./pages/Page404";
import Register from "./pages/Register";
import DNlogin from "./pages/DNlogin";
import DNforgotpwd from "./pages/DNforgotpwd";
import DNUpdatePwd from "./pages/DNUpdatePwd";
import AddNewEmp from "./pages/AddNewEmp";
import AddNewMember from "./pages/AddNewMember";
import Employees from "./pages/Employees";
import DNNewFD from "./pages/DNNewFD";
import DNFixedDeposit from "./pages/DNFixedDeposit";
import DNLoan from "./pages/DNLoan";
import Loan from "./pages/Loan";
import DNBranch from "./pages/DNBranch";
import DNArea from "./pages/DNArea";
import DNDashboardApp from "./pages/DNDashboardApp";
import DNRecurringDeposit from "./pages/DNRecurringDeposit";
import RecurringDeposit from "./pages/RecurringDeposit";
import UserRole from "./pages/UserRole";
import DNUserRole from "./pages/DNUserRole";
import EditRoleForm from "./sections/auth/DNRole/EditRoleForm";
import DisableRoleForm from "./sections/auth/DNRole/DisableRoleForm";
import Member from "./pages/Member";
import MemberView from "./sections/auth/MemberView/MemberView";
import KycBucket from "./pages/Kycbucket";
import { KycApprovalForm } from "./sections/auth/KYC";
import CollectionEntry from "./pages/CollectionEntry";
import { ApplicationApprovalForm } from "./sections/auth/ApplicationApproval";
import { EditEmployee } from "./sections/auth/AddNewEmployee";
import EditMember from "./sections/auth/AddNewMember/EditMember";
import CollectionSheet from "./pages/CollectionSheet";
import LoanDisbursementForm from "./sections/auth/LoanDisbursement/LoanDisbursementForm";
import MemberData from "./components/MemberData";
import ReportModule from "./pages/ReportModule";
// ----------------------------------------------------------------------

export default function Router() {
  const roless = sessionStorage.getItem("role");
  return useRoutes([
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { path: "app", element: <DNDashboardApp /> },
       
        roless=="ROLE_ADMIN" ?  { path: "Employee", element: <Employees /> }:"",
        roless=="ROLE_ADMIN" ? { path: "Employee/AddNewEmp", element: <AddNewEmp /> }:"",
      
        { path: "Member/AddNewMember", element: <AddNewMember /> },
        { path: "DNFixedDeposit/DNNewFD", element: <DNNewFD /> },
        roless==="ROLE_ADMIN" ? { path: "area", element: <DNArea /> }:"",
        roless==="ROLE_ADMIN" ?  { path: "branch", element: <DNBranch /> }:"",
        roless==="ROLE_ADMIN" || roless==="ROLE_FO" ? { path: "CollectionEntry", element: <CollectionEntry /> }:"",
        { path: "DNFixedDeposit", element: <DNFixedDeposit /> },
        { path: "Loan/DNLoan", element: <DNLoan /> },
        { path: "Loan", element: <Loan /> },
        { path: "RecurringDeposit", element: <RecurringDeposit /> },
        {
          path: "RecurringDeposit/DNRecurringDeposit",
          element: <DNRecurringDeposit />,
        },
        { path: "DNUserRole", element: <DNUserRole /> },
        { path: "EditRoleForm", element: <EditRoleForm /> },
        { path: "DisableRoleForm", element: <DisableRoleForm /> },
        { path: "Member", element: <Member /> },
        { path: "Member/MemberView", element: <MemberView /> },
        { path: "UserRole", element: <UserRole /> },
        { path: "KycBucket", element: <KycBucket /> },
        roless==="ROLE_ADMIN" || roless==="ROLE_FO" ?  { path: "app/KycApprovalForm", element: <KycApprovalForm /> }:"",
        roless==="ROLE_ADMIN" || roless==="ROLE_BM" ? {
          path: "app/ApplicationApprovalForm",
          element: <ApplicationApprovalForm />,
        }:"",
        roless==="ROLE_ADMIN" || roless==="ROLE_BM" ? {
          path: "app/LoanDisbursementForm",
          element: <LoanDisbursementForm />,
        }:"",
        roless==="ROLE_ADMIN" ? { path: "Employee/EditEmployee", element: <EditEmployee /> }:"",
        { path: "Member/EditMember", element: <EditMember /> },
        roless==="ROLE_ADMIN" || roless==="ROLE_FO" ? { path: "CollectionSheet", element: <CollectionSheet /> }:"",
        { path: "MemberData", element: <MemberData /> },
        roless==="ROLE_ADMIN" ?   { path: "ReportModule", element: <ReportModule /> }:"",
      ],
    },
    {
      path: "/",
      element: <LogoOnlyLayout />,
      children: [
        { path: "/", element: <Navigate to="/login" /> },
        // { path: 'login', element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "404", element: <NotFound /> },
        { path: "*", element: <Navigate to="/404" /> },
        { path: "login", element: <DNlogin /> },
        { path: "DNforgotpwd", element: <DNforgotpwd /> },
        { path: "DNUpdatePwd", element: <DNUpdatePwd /> },
        { path: "DNLoan", element: <DNLoan /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
