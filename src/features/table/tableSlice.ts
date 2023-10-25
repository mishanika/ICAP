import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { GetThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";

export interface TableState {
  count: number;
  next: null | string;
  previous: null | string;
  results: TableCell[];
  isLoading: boolean;
  error: string;
  offset: number;
  limit: number;
  activePage: number;
}

export interface TableCell {
  id: number;
  name: string;
  email: string;
  birthday_date: string;
  phone_number: string;
  address: string;
}

const initialState = {
  count: 0,
  next: "",
  previous: null,
  results: [
    {
      id: 0,
      name: "",
      email: "",
      birthday_date: "",
      phone_number: "",
      address: "",
    },
  ],
  isLoading: false,
  error: "",
  limit: 10,
  offset: 0,
  activePage: 0,
};

export const fetchContent = createAsyncThunk<any, { type: string }, { state: { table: TableState } }>(
  "content/fetchContent",
  async ({ type }, { getState }) => {
    if (type === "initial") {
      const res = await fetch("https://technical-task-api.icapgroupgmbh.com/api/table/");
      const data = await res.json();
      return data;
    }

    const url = type === "next" ? getState().table.next : getState().table.previous;
    if (url) {
      const res = await fetch(url);
      const data = await res.json();
      return data;
    }
  }
);

export const fetchCertainPage = createAsyncThunk<
  any,
  { limit: number; offset: number },
  { state: { table: TableState } }
>("content/fetchCertainPage", async ({ limit, offset }) => {
  const url = `https://technical-task-api.icapgroupgmbh.com/api/table/?limit=${limit}&offset=${offset}`;
  if (url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }
});

const compare = (type: string) => {
  return (a: TableCell, b: TableCell) => {
    if (a[type as keyof TableCell] < b[type as keyof TableCell]) return -1;
    if (a[type as keyof TableCell] > b[type as keyof TableCell]) return 1;
    return 0;
  };
};

export const tableSlice = createSlice({
  name: "table",
  initialState,

  reducers: {
    changeLimitOffset: (state, action) => {
      state.limit = action.payload.limit;
      state.offset = action.payload.offset;
    },
    changeActivePage: (state, action) => {
      state.activePage = action.payload.id;
    },
    sortById: (state) => {
      state.results = state.results.sort(compare("id"));
    },
    sortByName: (state) => {
      state.results = state.results.sort(compare("name"));
    },
    sortByEmail: (state) => {
      state.results = state.results.sort(compare("email"));
    },
    sortByDate: (state) => {
      state.results = state.results.sort(compare("birthday_date"));
    },
    sortByNumber: (state) => {
      state.results = state.results.sort(compare("phone_number"));
    },
    sortByAddress: (state) => {
      state.results = state.results.sort(compare("address"));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchContent.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchContent.fulfilled, (state, action) => {
      state.isLoading = false;
      state.count = action.payload.count;
      state.next = action.payload.next;
      state.previous = action.payload.previous;
      state.results = action.payload.results;
    });
    builder.addCase(fetchContent.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message as string;
    });

    builder.addCase(fetchCertainPage.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCertainPage.fulfilled, (state, action) => {
      state.isLoading = false;
      state.count = action.payload.count;
      state.next = action.payload.next;
      state.previous = action.payload.previous;
      state.results = action.payload.results;
    });
    builder.addCase(fetchCertainPage.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message as string;
    });
  },
});

export const {
  changeLimitOffset,
  changeActivePage,
  sortByNumber,
  sortByName,
  sortByAddress,
  sortByDate,
  sortByEmail,
  sortById,
} = tableSlice.actions;

export const selectTable = (state: RootState) => state.table;

export default tableSlice.reducer;
