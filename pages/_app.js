import "../styles/globals.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import React, { useContext } from "react";
import Header from "../components/Header";
import { FirstLayer } from "../utils/AuthLayers";

// optional configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_RIGHT,
  timeout: 5000,
  offset: "5px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

const queryClient = new QueryClient();
function MyApp({ Component, pageProps }) {
  console.log(pageProps.userType);
  return (
    <QueryClientProvider client={queryClient}>
      <AlertProvider template={AlertTemplate} {...options}>
        {FirstLayer.includes(pageProps.userType) && (
          <Header userType={pageProps.userType} />
        )}
        <Component {...pageProps} />
      </AlertProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
