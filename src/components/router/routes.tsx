import Login from "../../pages/login/Login";
import Table from "../../pages/table/Table";

export type IRoute = {
  path: string;
  element: JSX.Element;
};

export const routes: IRoute[] = [
  {
    path: "/",
    element: <Table />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];
