import { createContext, useState } from "react";

const initialState = {
  startPoint: [],
  endPoint: [],
  setStartPoint: () => null,
  setEndPoint: () => null,
};

const RoutingContext = createContext(initialState);

export const RoutingProvider = ({ children }) => {
  const [startPoint, setStartPoint] = useState([]);
  const [endPoint, setEndPoint] = useState([]);

  <RoutingContext.Provider
    value={(startPoint, endPoint, setStartPoint, setEndPoint)}
  >
    {children}
  </RoutingContext.Provider>;
};

export const useRouting = () => useContext(RoutingContext);
