import React, { useContext, useEffect, useRef, useState } from "react";
import { models } from "powerbi-client";
import 'powerbi-client/dist/powerbi'; // 👈 Ensure this is imported
import axios from "axios"
import { URLContextProvider } from "./context/CentralStorageContext";

const PowerBIReport = () => {
  const reportRef = useRef(null);

    const {url} = useContext(URLContextProvider)
  
  
    const startTheServer = async () => {
      const response = await axios.get(url);
      console.log(response.data.message);
    };
  
    useEffect(() => {
      startTheServer()
    },[])

  const [activeDashBoard, setActiveDashboard] = useState(0)

  const dashboardsData = [
    {
        id: 1, 
        dashName: "Revenue, Clinical and Equipment Failure", 
        groupID: "0800dc12-04e5-484e-b15e-ba0a27efa5c2", 
        reportId: "e0d44e90-be86-4d65-973e-59f1a17f6b26",
        category: "Supply Chain Models"
    },
    {
        id: 2, 
        dashName: "Inventory Reorder Point & Safety Stock predictions", 
        groupID: "0800dc12-04e5-484e-b15e-ba0a27efa5c2", 
        reportId: "e6d17e90-cf61-4364-a160-f0f76b014929",
        category: "Supply Chain Models"
    },
    {
        id: 3, 
        dashName: "Predicted Reams of Paper & Ink", 
        groupID: "7235dce4-8159-49bc-ab3f-223406e7937b", 
        reportId: "cdc28a63-1551-4b0c-8385-1150e1dd46ce",
        category: "Supply Chain Models"
    },
    {
        id: 4, 
        dashName: "Sales Order Processing", 
        groupID: "84691a96-fa30-4e99-8ebf-da73b935661b", 
        reportId: "12256cd6-0191-4734-b9e2-26fb5da6f018",
        category: "Order To Cash"
    },
    {
        id: 5, 
        dashName: "Outbound Delivery Processing", 
        groupID: "84691a96-fa30-4e99-8ebf-da73b935661b", 
        reportId: "a55c32db-32a9-42d9-8a3b-b4acb5d156c3",
        category: "Order To Cash"
    },
    {
        id: 6, 
        dashName: "Billing & Invoicing", 
        groupID: "84691a96-fa30-4e99-8ebf-da73b935661b", 
        reportId: "39b627f4-0188-4651-890f-d03aa68c9ab3",
        category: "Order To Cash"
    },
    {
        id: 7, 
        dashName: "Supplier Order Overview", 
        groupID: "84691a96-fa30-4e99-8ebf-da73b935661b", 
        reportId: "0c34af53-228f-49e3-a217-c7942da55d86",
        category: "Procurement"
    },
    
    {
        id: 8, 
        dashName: "Manufacturing Master Data", 
        groupID: "84691a96-fa30-4e99-8ebf-da73b935661b", 
        reportId: "bad34a0b-01fa-4257-9e3f-9fec93098e18",
        category: "Manufacturing"
    },
    {
        id: 9, 
        dashName: "Manufacturing Order", 
        groupID: "84691a96-fa30-4e99-8ebf-da73b935661b", 
        reportId: "df3ab764-9488-4e8c-a116-15f45ddf85b4",
        category: "Manufacturing"
    },
    {
        id: 10, 
        dashName: "Production Planning", 
        groupID: "84691a96-fa30-4e99-8ebf-da73b935661b", 
        reportId: "41761ec2-cb0f-43c0-9219-d31f2acc352b",
        category: "Manufacturing"
    },
  ]

  // useEffect(() => {
  //   const fetchEmbedToken = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5000/get-embed-token");
  //       const data = await response.json();
  //       console.log(data)

  //       const embedConfig = {
  //         type: "report",
  //         tokenType: models.TokenType.Embed, 
  //         accessToken: data.token.token,
  //         embedUrl: data.token.embedUrl,
  //         id: data.reportId,
  //         settings: {
  //           panes: {
  //             filters: { visible: false },
  //             pageNavigation: { visible: true }
  //           },
  //           navContentPaneEnabled: true
  //         }
  //       };

  //       // Use global powerbi object
  //       // const report = window.powerbi.embed(reportRef.current, embedConfig);
  //       const report = window.powerbi.embed(reportRef.current,embedConfig);
  //       // reportRef.current, 

  //       report.on("loaded", () => {
  //         console.log("Report loaded successfully");
  //       });

  //       report.on("error", (event) => {
  //         console.error("Power BI error:", event.detail);
  //       });
  //     } catch (error) {
  //       console.error("Error embedding Power BI report:", error);
  //     }
  //   };

  //   fetchEmbedToken();
  // }, []);

  const getReportSpecificData = async (id, groupID, reportID) => {
    setActiveDashboard(id)

    try {

      const dashIdsData = {
        groupID: groupID,
        reportID: reportID
      }
    const response = await axios.post(url+`/get-embed-token`, dashIdsData);
    // const data = await response.json();
    console.log(response.data)
    const data = response.data
      const embedConfig = {
        type: "report",
        tokenType: models.TokenType.Embed, 
        accessToken: data.token.token,
        embedUrl: data.token.embedUrl,
        id: data.reportId,
        settings: {
          panes: {
            filters: { visible: false },
            pageNavigation: { visible: true }
          },
          navContentPaneEnabled: true
        }
      };

      // Use global powerbi object
      // const report = window.powerbi.embed(reportRef.current, embedConfig);

      const containerID = `report-container-${id}`

      const reportContainer = document.getElementById(containerID)

      // const report = window.powerbi.embed(reportContainer,embedConfig);
      const report = window.powerbi.embed(reportContainer,embedConfig);
      // reportRef.current, 

      report.on("loaded", () => {
        console.log("Report loaded successfully");
      });

      report.on("error", (event) => {
        console.error("Power BI error:", event.detail);
      });
    } catch (error) {
      console.error("Error embedding Power BI report:", error);
    }
  }

  const fetchEmbedToken = async () => {
        // setActiveDashboard(id)
        try {
          const response = await fetch(url+"/get-embed-token");
          const data = await response.json();
          console.log(data)
          const embedConfig = {
            type: "report",
            tokenType: models.TokenType.Embed, 
            accessToken: data.token.token,
            embedUrl: data.token.embedUrl,
            id: data.reportId,
            settings: {
              panes: {
                filters: { visible: false },
                pageNavigation: { visible: true }
              },
              navContentPaneEnabled: true
            }
          };
  
          // Use global powerbi object
          // const report = window.powerbi.embed(reportRef.current, embedConfig);

          const report = window.powerbi.embed(reportRef.current,embedConfig);
          // reportRef.current, 
  
          report.on("loaded", () => {
            console.log("Report loaded successfully");
          });
  
          report.on("error", (event) => {
            console.error("Power BI error:", event.detail);
          });
        } catch (error) {
          console.error("Error embedding Power BI report:", error);
        }
      };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Embedded Power BI Report</h2>
      <div>
        <h2>Dashboard Buttons</h2>
        <div>
          {
            dashboardsData.map((dashboard, index) => {
              return(
                  <button 
                  key={index}
                  style={{margin: "10px",
                    backgroundColor: activeDashBoard === dashboard.id ? "white" : "",
                    color: activeDashBoard === dashboard.id ? "black" : "",
                    border: "1px solid #fff"
                  }}
                  onClick={() => 
                    // fetchEmbedToken(dashboard.id, dashboard.groupID, dashboard.reportId)
                    getReportSpecificData(dashboard.id, dashboard.groupID, dashboard.reportId)
                  }
                  >{dashboard.dashName}</button>
              )
            })
          }
          <button style={{
                    border: "1px solid #fff"
          }} onClick={fetchEmbedToken}>Get Data</button>
        </div>
      </div>
      {/* <div
        id={`report-container-${activeDashBoard}`}
        style={{margin: "auto", marginTop: "20px",padding: "50px", height: "90vh", width: "80vw",  border: "1px solid #ccc" }}
      ></div> */}

      <div
        // id={`report-container-${dashboard.id}`}
        ref={reportRef}
        style={{margin: "auto", marginTop: "20px",padding: "50px", height: "90vh", width: "80vw",  border: "1px solid #ccc" }}
      ></div>
    </div>
  );
};

export default PowerBIReport;

