import { useRef } from "react";
import "./Popup.scss";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { TableState, fetchCertainPage, selectTable } from "../../features/table/tableSlice";

type Handler = {
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreatePoup?: React.Dispatch<React.SetStateAction<boolean>>;
};

type Cell = {
  id?: number;
  name?: string;
  email?: string;
  birthday_date?: string;
  phone_number?: string;
  address?: string;
  index: number;
  isCreatePoup?: boolean;
};

const Popup = ({
  id,
  name,
  email,
  birthday_date,
  phone_number,
  address,
  index,
  isCreatePoup,
  setIsPopupOpen,
  setIsCreatePoup,
}: Cell & Handler) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const idRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const selector: TableState = useAppSelector(selectTable);

  const closePopup = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === wrapperRef.current) {
      setIsPopupOpen(false);
    }
  };

  const changeData = async (e: React.FormEvent<HTMLFormElement>) => {
    const data = {
      id: id,
      name: nameRef.current?.value,
      email: emailRef.current?.value,
      birthday_date: dateRef.current?.value,
      phone_number: numberRef.current?.value,
      address: addressRef.current?.value,
    };

    const response = await fetch(`https://technical-task-api.icapgroupgmbh.com/api/table/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  };

  const createCell = async (e: React.FormEvent<HTMLFormElement>) => {
    const data = {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
      birthday_date: dateRef.current?.value,
      phone_number: numberRef.current?.value,
      address: addressRef.current?.value,
    };

    const response = await fetch(`https://technical-task-api.icapgroupgmbh.com/api/table/`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let response;
    if (isCreatePoup) {
      response = await createCell(e);
    } else {
      response = await changeData(e);
    }
    const responseData: {
      name?: string;
      email?: string;
      birthday_date?: string;
      phone_number?: string;
      address?: string;
    } = await response.json();

    if (!response.ok) {
      console.log(errorRef.current);
      errorRef.current!.textContent = "";
      errorRef.current!.style.color = "#f54f4f";
      for (const [key, value] of Object.entries(responseData)) {
        errorRef.current!.textContent += key + ": " + value + " ";
      }
      return;
    }

    dispatch(fetchCertainPage({ limit: selector.limit, offset: selector.activePage * selector.limit }));
    setIsPopupOpen(false);

    if (setIsCreatePoup) {
      setIsCreatePoup(false);
    }
  };

  return (
    <div className="popup-wrapper" onClick={(e) => closePopup(e)} ref={wrapperRef}>
      <form className={`cell ${index % 2 ? "odd" : "even"}`} onSubmit={(e) => submitHandler(e)}>
        <div className="error" ref={errorRef}>
          There will be errors
        </div>
        <input type="text" placeholder={id ? id + "" : "id, you can't type it"} ref={idRef} disabled />
        <input type="text" placeholder={name ? name : "name"} ref={nameRef} />
        <input type="text" placeholder={email ? email : "email"} ref={emailRef} />
        <input type="date" placeholder={birthday_date ? birthday_date : "birthday_date"} ref={dateRef} />
        <input type="text" placeholder={phone_number ? phone_number : "phone_number"} ref={numberRef} />
        <input type="text" placeholder={address ? address : "address"} ref={addressRef} />
        <input type="submit" value={isCreatePoup ? "Create cell" : "Change data"} />
      </form>
    </div>
  );
};

export default Popup;
