import React, { useContext, useEffect } from "react";
import PowerBIReport from "./PowerBIReport";
import axios from "axios"
import { URLContextProvider } from "./context/CentralStorageContext";

function App() {

  const {url} = useContext(URLContextProvider)
  console.log(url)

  const startTheServer = async () => {
    const response = await axios.get(url);
    console.log(response.data.message);
  };

  useEffect(() => {
    startTheServer()
  },[])
  return (
    <div className="App">
      <PowerBIReport />
    </div>
  );
}

export default App;
