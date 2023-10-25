import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { TableState, fetchCertainPage, selectTable } from "../../features/table/tableSlice";
import "./Cell.scss";

type Cell = {
  id: number;
  name: string;
  email: string;
  birthday_date: string;
  phone_number: string;
  address: string;
  index: number;
};

type Handlers = {
  setActiveCell: React.Dispatch<React.SetStateAction<number>>;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Cell = ({
  id,
  name,
  email,
  birthday_date,
  phone_number,
  address,
  index,
  setActiveCell,
  setIsPopupOpen,
}: Cell & Handlers) => {
  const dispatch = useAppDispatch();
  const selector: TableState = useAppSelector(selectTable);

  const cellHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setActiveCell(index);
    setIsPopupOpen(true);
  };

  return (
    <div className={`cell ${index % 2 ? "odd" : "even"}`} onClick={(e) => cellHandler(e)}>
      <div className="cell-id">{id}</div>
      <div className="cell-name">{name}</div>
      <div className="cell-email">{email}</div>
      <div className="cell-birthday">{birthday_date}</div>
      <div className="cell-number">{phone_number}</div>
      <div className="cell-address">{address}</div>
    </div>
  );
};

export default Cell;
