import { useEffect, useState } from "react";
import "./Table.scss";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  TableCell,
  TableState,
  fetchContent,
  selectTable,
  sortByAddress,
  sortByDate,
  sortByEmail,
  sortById,
  sortByName,
  sortByNumber,
} from "../../features/table/tableSlice";
import Cell from "../../components/cell/Cell";
import Pagination from "../../components/pagination/Pagination";
import Popup from "../../components/popup/Popup";
import { useNavigate } from "react-router-dom";

const Table: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selector: TableState = useAppSelector(selectTable);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCreatePoup, setIsCreatePoup] = useState(false);
  const [activeCell, setActiveCell] = useState(-1);

  useEffect(() => {
    dispatch(fetchContent({ type: "initial" }));
  }, [dispatch]);

  const tableRender = (item: TableCell, index: number) => (
    <Cell {...item} index={index} setIsPopupOpen={setIsPopupOpen} setActiveCell={setActiveCell} />
  );

  const createCell = () => {
    setIsPopupOpen(true);
    setIsCreatePoup(true);
  };

  useEffect(() => {
    if (!localStorage.getItem("auth")) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      {isPopupOpen ? (
        isCreatePoup ? (
          <Popup index={activeCell} setIsPopupOpen={setIsPopupOpen} isCreatePoup={isCreatePoup} />
        ) : (
          <Popup {...selector.results[activeCell]} index={activeCell} setIsPopupOpen={setIsPopupOpen} />
        )
      ) : (
        false
      )}
      <div className="table-wrapper">
        <div className="buttons-sort">
          <div className="create" onClick={() => createCell()}>
            Create
          </div>
          <div className="sort-wrapper">
            <span>Sort by</span>
            <div className="sorts">
              <span onClick={() => dispatch(sortById())}>ID</span>
              <span onClick={() => dispatch(sortByName())}>Name</span>
              <span onClick={() => dispatch(sortByEmail())}>Email</span>
              <span onClick={() => dispatch(sortByDate())}>Birthday Date</span>
              <span onClick={() => dispatch(sortByNumber())}>Phone Number</span>
              <span onClick={() => dispatch(sortByAddress())}>Address</span>
            </div>
          </div>
        </div>
        <div className="table">
          <div className="header">
            <div className="cell-id">ID</div>
            <div className="cell-name">Name</div>
            <div className="cell-email">Email</div>
            <div className="cell-birthday">Birthday Date</div>
            <div className="cell-number">Phone Number</div>
            <div className="cell-address">Address</div>
          </div>
          {selector.results.map(tableRender)}
        </div>
        <Pagination />
      </div>
    </>
  );
};

export default Table;
