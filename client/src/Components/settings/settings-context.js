import { createContext } from "react";

export const settingsInitialState = {
  companies: [],
};

export const settingsReducer = (state, action) => {
  switch (action.type) {
    case "get_companies":
      return { ...state, companies: action.payload };
    case "add_company":
      return { ...state, companies: [...state.companies, action.payload] };
    case "remove_company":
      return {
        ...state,
        companies: state.companies.filter((c) => c.name !== action.payload),
      };
    default:
      return state;
  }
};

export const SettingsContext = createContext(settingsInitialState);
