// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const DNNavConfig = [
  {
    title: "dashboard",
    path: "/dashboard/app",
    icon: getIcon("eva:pie-chart-2-fill"),
  },
  // {
  //   title: "user",
  //   path: "/dashboard/user",
  //   icon: getIcon("eva:people-fill"),
  // },
  {
    title: "Employee",
    path: "/dashboard/Employee",
    icon: getIcon("eva:people-fill"),
  },
  {
    title: " Loans",
    path: "/dashboard/Loan",
    icon: getIcon("emojione-monotone:money-with-wings"),
  },
  {
    title: "Fixed Deposit",
    path: "/dashboard/DNFixedDeposit",

    icon: getIcon("healthicons:money-bag"),
  },
  {
    title: "Recurring Deposit",
    path: "/dashboard/RecurringDeposit",

    icon: getIcon("healthicons:money-bag"),
  },
  // {
  //   title: 'User Role',
  //   path: '/dashboard/UserRole',

  //   icon: getIcon("healthicons:money-bag")
  // },

  // {
  //   title: "blog",
  //   path: "/dashboard/blog",
  //   icon: getIcon("eva:file-text-fill"),
  // },
  // {
  //   title: "login",
  //   path: "/login",
  //   icon: getIcon("eva:lock-fill"),
  // },
  // {
  //   title: "register",
  //   path: "/register",
  //   icon: getIcon("eva:person-add-fill"),
  // },
];

export default DNNavConfig;
