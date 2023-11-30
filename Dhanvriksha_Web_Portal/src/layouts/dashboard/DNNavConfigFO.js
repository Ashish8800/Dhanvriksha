// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const DNNavConfigFO = [
  {
    title: "dashboard",
    path: "/dashboard/app",
    icon: getIcon("eva:grid-fill"),
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
];

export default DNNavConfigFO;
