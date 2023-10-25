import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  TableState,
  changeActivePage,
  changeLimitOffset,
  fetchCertainPage,
  fetchContent,
  selectTable,
} from "../../features/table/tableSlice";
import "./Pagination.scss";

const Pagination: React.FC = () => {
  const selector: TableState = useAppSelector(selectTable);
  const dispatch = useAppDispatch();
  const pagesRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const [visiblePages, setVisiblePages] = useState<number[]>([]);

  const pageCount = Math.ceil(selector.count / 10);
  let pageArray: number[] = [];
  pageArray = new Array(pageCount).fill(0, 0, pageCount).map((item, id) => id + 1);

  const updateVisiblePages = () => {
    const start = Math.max(1, activePage - Math.floor(4 / 2));
    const end = Math.min(pageCount, start + 4 - 1);

    setVisiblePages([...pageArray.slice(start - 1, end)]);
  };

  const pagesRender = (item: number, id: number) => (
    <div className={`page ${!id ? "active" : ""}`} onClick={() => pageClickHandler(id)}>
      {item}
    </div>
  );

  const pageClickHandler = (id: number) => {
    dispatch(fetchCertainPage({ limit: selector.limit, offset: id * selector.limit }));

    dispatch(changeActivePage({ id: id }));
    setActivePage(id);
  };

  const nextHandler = () => {
    if (selector.activePage + 1 > pageCount - 1) {
      return;
    }
    dispatch(fetchContent({ type: "next" }));
    dispatch(changeActivePage({ type: "next" }));
    setActivePage((prev) => (prev + 1 > pageCount - 1 ? pageCount - 1 : prev + 1));
  };

  const prevHandler = () => {
    if (selector.activePage - 1 < 0) {
      return;
    }
    dispatch(fetchContent({ type: "prev" }));
    dispatch(changeActivePage({ type: "next" }));
    setActivePage((prev) => (prev - 1 < 0 ? 0 : prev - 1));
  };

  useEffect(() => {
    if (pagesRef.current) {
      const elements = Array.from(pagesRef.current?.children) as HTMLDivElement[];
      elements.forEach((item, id) => {
        parseInt(item.textContent!) - 1 === activePage ? item.classList.add("active") : item.classList.remove("active");
      });
    }
    // dispatch(changeLimitOffset(changeLimitOffset({ limit: limit, offset: offset + limit })));
  }, [activePage, visiblePages]);

  useEffect(() => {
    updateVisiblePages();
  }, [pageCount, activePage]);

  return (
    <div className="pagination">
      <div className="prev" onClick={() => prevHandler()}>
        {"< Prev"}
      </div>
      <div className="pages" ref={pagesRef}>
        {visiblePages[0] > 1 && (
          <>
            <div className="page" onClick={() => pageClickHandler(0)}>
              1
            </div>
            {visiblePages[0] > 2 && <div className="ellipsis">...</div>}
          </>
        )}
        {visiblePages.map((page, id) => (
          <div key={page} className={`page ${!id ? "active" : ""}`} onClick={() => pageClickHandler(page - 1)}>
            {page}
          </div>
        ))}
        {visiblePages[visiblePages.length - 1] < pageCount && (
          <>
            {visiblePages[visiblePages.length - 1] < pageCount - 1 && <div className="ellipsis">...</div>}
            <div className="page" onClick={() => pageClickHandler(pageCount - 1)}>
              {pageCount}
            </div>
          </>
        )}
      </div>
      <div className="next" onClick={() => nextHandler()}>
        {"Next >"}
      </div>
    </div>
  );
};

export default Pagination;
