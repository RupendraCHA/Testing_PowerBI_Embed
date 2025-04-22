const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors")
const qs = require("qs");

require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.use(cors())

const PORT = 5000;

const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const workspaceId = process.env.WORKSPACE_ID;
const reportId = process.env.REPORT_ID;

// Azure AD Token endpoint
// const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

// app.get("/get-embed-token", async (req, res) => {
//   try {
//     // Step 1: Get Azure AD Token
//     const tokenResponse = await axios.post(
//       tokenEndpoint,
//       new URLSearchParams({
//         grant_type: "client_credentials",
//         client_id: clientId,
//         client_secret: clientSecret,
//         scope: "https://analysis.windows.net/powerbi/api/.default",
//       }),
//       { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
//     );

//     // console.log("TOKEN_RESPONSE", tokenResponse.data)

//     const accessToken = tokenResponse.data.access_token;

//     // Step 2: Generate Embed Token for Report
//     const embedResponse = await axios.post(
//       `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`,
//       {
//         accessLevel: "View",
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     // console.log("EMBED_RESPONSE", embedResponse)

//     const embedToken = embedResponse.data;
//     const embedUrl = embedResponse.data.embedUrl;

//     console.log(embedUrl)
//     res.json({ token: embedToken });
//   } catch (error) {
//     console.error("Error generating embed token:", error.response?.data || error.message);
//     res.status(500).send("Failed to generate embed token");
//   }
// });


// get-embed-token route (Node.js with axios)


app.get("/get-embed-token", async (req, res) => {
  try {
    // Get access token from Azure AD
    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      qs.stringify({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://analysis.windows.net/powerbi/api/.default"
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get report details (to fetch embedUrl) //
    // 
    const reportResponse = await axios.get(
      `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const embedUrl = reportResponse.data.embedUrl;

    // Generate Embed token
    const embedTokenResponse = await axios.post(
      `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`,
      {
        accessLevel: "view"
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    const embedToken = embedTokenResponse.data.token;

    res.json({
      reportId: reportId,
      token: {
        token: embedToken,
        embedUrl: embedUrl
      }
    });
  } catch (err) {
    console.error("Error getting embed token:", err);
    res.status(500).send("Failed to get embed token");
  }
});

app.post("/get-embed-token", async (req, res) => {

  const {groupID, reportID} = req.body

  // console.log(groupID, reportID)
  try {
    // Get access token from Azure AD
    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      qs.stringify({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://analysis.windows.net/powerbi/api/.default"
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get report details (to fetch embedUrl) //
    // 
    const reportResponse = await axios.get(
      `https://api.powerbi.com/v1.0/myorg/groups/${groupID}/reports/${reportID}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const embedUrl = reportResponse.data.embedUrl; 

    // Generate Embed token
    const embedTokenResponse = await axios.post(
      `https://api.powerbi.com/v1.0/myorg/groups/${groupID}/reports/${reportID}/GenerateToken`,
      {
        accessLevel: "view"
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    const embedToken = embedTokenResponse.data.token;
    // console.log(embedUrl)

    res.json({
      // reportId: reportID,
      reportId: groupID,
      token: {
        token: embedToken,
        embedUrl: embedUrl
      }
    });
  } catch (err) {
    console.error("Error getting embed token:", err.message);
    res.status(500).send("Failed to get embed token");
  }
});

app.get("/", (req, res) => {
  
  res.status(200).json({message: "Backend is Active"})
});

app.listen(PORT, () => {
  console.log(`Power BI Token Server running on http://localhost:${PORT}`);
});
