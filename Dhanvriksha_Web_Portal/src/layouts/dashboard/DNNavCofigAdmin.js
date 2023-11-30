// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const DNNavConfigAdmin = [
  {
    title: "dashboard",
    path: "/dashboard/app",
    icon: getIcon("eva:grid-fill"),
  },
  {
    title: "Branch",
    path: "/dashboard/branch",
    icon: getIcon("eva:layers-fill"),
  },
  {
    title: "Area",
    path: "/dashboard/area",
    icon: getIcon("eva:layers-outline"),
  },
  {
    title: "Employees",
    path: "/dashboard/Employee",
    icon: getIcon("fa-solid:user-tie"),
  },
  {
    title: " Loans",
    path: "/dashboard/Loan",
    icon: getIcon("fa-solid:hand-holding-usd"),
  },
  {
    title: "Fixed Deposit",
    path: "/dashboard/DNFixedDeposit",
    icon: getIcon("healthicons:money-bag"),
  },
  {
    title: "Recurring Deposit",
    path: "/dashboard/RecurringDeposit",
    icon: getIcon("fa6-solid:money-bills"),
  },
  // {
  //   title: "User Role",
  //   path: "/dashboard/UserRole",
  //   icon: getIcon("healthicons:money-bag"),
  // },
  {
    title: "Members",
    path: "/dashboard/Member",
    icon: getIcon("eva:people-fill"),
  },

  {
    title: "Collection Entry",
    path: "/dashboard/CollectionEntry",
    icon: getIcon("eva:file-add-fill"),
  },
  {
    title: "Collection Sheet",
    path: "/dashboard/CollectionSheet",

    icon: getIcon("fa6-solid:file-pen"),
  },
  {
    title: "Reports",
    path: "/dashboard/ReportModule",

    icon: getIcon("bxs:report"),
  },
  
];

export default DNNavConfigAdmin;
