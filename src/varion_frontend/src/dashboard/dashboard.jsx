import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import Patients from "./patients";
import { FiHome, FiHeart, FiLogOut } from "react-icons/fi";
import { FiAlertCircle } from "react-icons/fi";
import { useConnect } from "@connect2ic/react";
import { varion_backend } from "declarations/varion_backend";
import { ResponsiveBar } from "@nivo/bar";

/* --- STYLE VARIABLES FOR VARION THEME --- */
const colors = {
  primaryGradient: "linear-gradient(90deg, #1a75ed 0%, #36aade 100%)",
  primaryGradientHover: "linear-gradient(90deg, #0e53a4 0%, #208bd9 100%)",
  primaryText: "#064091",
  secondaryText: "#3755a4dd",
  backgroundLight: "rgba(255 255 255 / 0.28)",
  backgroundGlass: "rgba(255 255 255 / 0.3)",
  backgroundLightSolid: "#edf2f7",
  shadowBlue: "rgba(0, 123, 255, 0.18)",
  shadowSubtle: "rgba(0, 0, 0, 0.05)",
  sidebarGradient:
    "linear-gradient(359.3deg, rgb(196, 214, 252) 1%, rgba(187, 187, 187, 0) 70.9%)",
  modalOverlay: "rgba(14, 17, 22, 0.71)",
  modalBackground: "rgba(255 255 255 / 0.9)",
  errorRed: "#ef4444",
  errorHoverRed: "#dc2626",
  white: "#fff",
  grayText: "#3d4668dd",
  lightGrayText: "#7a8793",
  linkBlue: "#2060f0dd",
  linkBlueHover: "#134ac0",
};

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%);
  font-family: "Inter", "Poppins", "Helvetica Neue", Arial, sans-serif;
  color: ${colors.primaryText};
  letter-spacing: 0.015em;
`;

/* SIDEBAR STYLES */
const Sidebar = styled(motion.aside)`
  background: ${colors.sidebarGradient};
  min-width: 80px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 6px 32px rgba(20, 40, 90, 0.15);
  border-right: 1.3px solid rgba(255 255 255 / 0.4);
  user-select: none;
  z-index: 1200;
`;

const Logo = styled(motion.div)`
  padding: 30px 20px;
  text-align: center;
  margin-bottom: 30px;
  overflow: hidden;
  img {
    height: auto;
  }
`;

const Nav = styled.nav`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;

const NavItem = styled(motion.li)`
  padding: 18px 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #677294;
  font-size: 1.15rem;
  font-weight: 600;
  border-radius: 12px;
  margin: 8px 15px;
  user-select: none;
  transition: all 0.25s ease;

  &:hover,
  &:focus-visible {
    background: rgba(3, 67, 251, 0.11);
    color: ${colors.primaryText};
    box-shadow: 0 10px 40px rgba(3, 67, 251, 0.15);
    outline-offset: 3px;
  }

  &.active {
    background: ${colors.backgroundGlass};
    box-shadow: 0 14px 40px rgba(3, 67, 251, 0.18);
    color: ${colors.primaryText};
  }
`;

const Icon = styled.span`
  font-size: 1.75rem;
  min-width: 30px;
  display: flex;
  justify-content: center;
  color: inherit;
`;

const Label = styled(motion.span)`
  margin-left: 15px;
  white-space: nowrap;
  color: inherit;
  user-select: none;
`;

/* MAIN CONTENT */
const MainContent = styled.main`
  flex-grow: 1;
  padding: 2.25rem 3rem;
  overflow-y: auto;
  background: ${colors.white};
  border-radius: 28px;
  margin: 20px 40px 20px 20px;
  box-shadow: 0 8px 36px rgba(0, 123, 255, 0.18);
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

/* DASHBOARD BOX */
const DashboardContent = styled.section`
  padding: 2rem 2.5rem;
  background: ${colors.backgroundGlass};
  border-radius: 28px;
  box-shadow: 0 14px 50px rgb(33 111 242 / 0.3);
  color: ${colors.primaryText};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

/* CHART WRAPPER */
const ChartContainer = styled.div`
  height: 400px;
  margin-bottom: 2rem;
  background: ${colors.backgroundLightSolid};
  border-radius: 15px;
  padding: 24px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.07);
`;

/* CHART HEADER */
const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.75rem;
  user-select: none;
`;

const ChartTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: ${colors.primaryText};
`;

/* FORM & INPUTS */
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: ${colors.backgroundLightSolid};
  padding: 2rem 2.5rem;
  border-radius: 22px;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.06);
  user-select: none;
`;

const InstructionText = styled.p`
  font-weight: 600;
  font-size: 1.125rem;
  margin: 0;
  user-select: text;
  color: ${colors.primaryText};
`;

const StyledInput = styled.input`
  padding: 14px 20px;
  border: 1.5px solid #d1d9e6;
  border-radius: 16px;
  font-size: 1rem;
  width: 100%;
  color: ${colors.primaryText};
  letter-spacing: 0.015em;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${colors.primaryGradientHover};
    box-shadow: 0 0 10px ${colors.primaryGradientHover};
  }
`;

const StyledButton = styled.button`
  background: ${colors.primaryGradient};
  color: ${colors.white};
  border: none;
  padding: 14px 28px;
  border-radius: 24px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  width: 100%;
  letter-spacing: 0.6px;
  box-shadow: 0 8px 30px rgba(66, 133, 244, 0.35);
  transition: background 0.3s ease, box-shadow 0.22s ease;

  &:hover:not(:disabled) {
    background: ${colors.primaryGradientHover};
    box-shadow: 0 12px 48px rgba(66, 133, 244, 0.5);
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const StyledStartButton = styled(StyledButton)`
  background-color: #f54b9e;

  &:hover:not(:disabled) {
    background-color: #f7288d;
  }
`;

const ConfirmButton = styled(StyledButton)`
  width: 85%;
`;

const CancelButton = styled(StyledButton)`
  background-color: #ef4444;
  margin-left: 12px;
  width: 15%;

  &:hover:not(:disabled) {
    background-color: ${colors.errorHoverRed};
  }
`;

/* EXAMPLE TABLE */
const ExampleTable = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  margin-top: 0.75rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 24px rgb(33 111 242 / 0.12);
  user-select: none;
`;

const TableHeader = styled.th`
  background: ${colors.backgroundLightSolid};
  font-weight: 600;
  font-size: 1rem;
  color: ${colors.primaryText};
  padding: 12px 16px;
  text-align: center;
  width: ${(props) => (props.narrow ? "4%" : "16%")};
  border-bottom: 1.5px solid #cbd5e0;

  user-select: none;
`;

const TableCell = styled.td`
  padding: 12px 16px;
  text-align: center;
  font-size: 0.95rem;
  color: ${colors.secondaryText};
  width: ${(props) => (props.narrow ? "4%" : "16%")};
  border-bottom: 1.5px solid #cbd5e0;
  user-select: none;

  ${(props) =>
    props.bordered &&
    `
    border-left: 1.5px solid #cbd5e0;
    border-right: 1.5px solid #cbd5e0;
  `}
`;

const TableNotes = styled.p`
  margin-top: 1.25rem;
  color: ${colors.lightGrayText};
  font-weight: 700;
  font-size: 1rem;
  text-align: center;
  user-select: none;
`;

/* MODAL */
const Modal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: ${colors.modalOverlay};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1400;
`;

const ModalContent = styled(motion.div)`
  background: ${colors.modalBackground};
  padding: 2.5rem 3rem;
  border-radius: 28px;
  box-shadow: 0 14px 50px rgb(33 111 242 / 0.3);
  max-width: 440px;
  width: 90%;
  text-align: center;
  user-select: none;

  p {
    margin: 1.25rem 0 0 0;
    font-weight: 700;
    font-size: 1.25rem;
    color: ${colors.primaryText};
  }
`;

const ErrorIcon = styled(FiAlertCircle)`
  font-size: 60px;
  color: ${colors.errorRed};
`;

const ModalButton = styled(StyledButton)`
  max-width: 250px;
  margin-top: 1.75rem;
`;

/* NO DATA MESSAGE */
const NoDataMessage = styled.div`
  height: 100%;
  color: #718096;
  font-weight: 600;
  font-size: 1.15rem;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
`;

/* UTILS */
const maskToken = (token) => {
  if (!token || token.length <= 10) return "";
  const end = token.slice(-4);
  return `********${end}`;
};

const Dashboard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { disconnect } = useConnect();
  const [chartData, setChartData] = useState([]);
  const [link, setLink] = useState("");
  const [token, setToken] = useState("");
  const [modalError, setModalError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [originalLink, setOriginalLink] = useState("");
  const [originalToken, setOriginalToken] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [patientData, setPatientData] = useState([]);

  useEffect(() => {
    setChartData([]);
  }, []);

  const formatTime = (date) => {
    if (!date) return "";
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
  };

  /* Sidebar animation variants */
  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  };

  /* Label show/hide */
  const labelVariants = {
    expanded: { opacity: 1, display: "inline" },
    collapsed: { opacity: 0, transitionEnd: { display: "none" } },
  };

  const riskColors = {
    "Low Risk": "#56f589", // Green
    "Medium Risk": "#ffed72", // Yellow
    "High Risk": "#ff7272", // Red
  };

  const getRiskLevel = (value) => {
    if (value < 0.5) return "Low Risk";
    if (value < 0.75) return "Medium Risk";
    return "High Risk";
  };

  const closeModal = () => {
    setModalError(null);
  };

  const validateApiResponse = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }

    const requiredFields = ["HR", "BP", "SpO2", "RESP", "TEMP", "Patient_ID"];
    for (const row of data) {
      for (const field of requiredFields) {
        if (!row.hasOwnProperty(field) || row[field] === "") {
          return false;
        }
      }
    }
    return true;
  };

  const validateInputs = async () => {
    if (!link || !token) {
      setModalError(
        "Please enter both the link and Authorization Bearer token."
      );
      return false;
    }

    const urlPattern = /^https:\/\/sheetdb\.io\/api\/v1\/([\w\-]+)\/?$/;
    if (!urlPattern.test(link)) {
      setModalError("Please enter a valid sheetdb.io link.");
      return false;
    }

    try {
      const response = await fetch(link, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      if (!validateApiResponse(data)) {
        setModalError(
          "The data is missing required fields. Please ensure all rows contain HR, BP, SpO2, RESP, TEMP, and Patient_ID."
        );
        setLink("");
        setToken("");
        setIsSubmitted(false);
        return false;
      }
      return true;
    } catch (error) {
      setModalError(
        "An error occurred while fetching data. Please check your link and token."
      );
      setLink("");
      setToken("");
      setIsSubmitted(false);
      return false;
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(link, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (!validateApiResponse(data)) {
        throw new Error(
          "Some of the data is missing required fields or is empty."
        );
      }

      const formattedData = data
        .map((row) => `${row.HR},${row.BP},${row.SpO2},${row.RESP},${row.TEMP}`)
        .join("\n");

      const result = await varion_backend.prediction_result(formattedData);

      if (!result || !result.Success) {
        throw new Error("Invalid response from ML model");
      }

      const predictionValues = result.Success.split(",").map(Number);

      const processedPatientData = data.map((row, index) => ({
        id: row.Patient_ID,
        HR: row.HR,
        BP: row.BP,
        SpO2: row.SpO2,
        RESP: row.RESP,
        TEMP: row.TEMP,
        riskLevel: getRiskLevel(predictionValues[index]),
        cardiacProba: predictionValues[index],
        lastUpdated: formatTime(new Date()),
      }));

      setPatientData(processedPatientData);

      const riskLevelsCount = {
        "Low Risk": 0,
        "Medium Risk": 0,
        "High Risk": 0,
      };

      predictionValues.forEach((val) => {
        riskLevelsCount[getRiskLevel(val)]++;
      });

      setChartData([
        {
          id: "Risk Levels",
          data: [
            { x: "Low Risk", Patients: riskLevelsCount["Low Risk"] },
            { x: "Medium Risk", Patients: riskLevelsCount["Medium Risk"] },
            { x: "High Risk", Patients: riskLevelsCount["High Risk"] },
          ],
        },
      ]);

      setLastUpdateTime(new Date());
    } catch (error) {
      setModalError(`An error occurred: ${error.message}`);
    }
  };

  const handleStartStop = () => {
    setIsRunning((prev) => {
      if (prev) {
        clearInterval(intervalRef.current);
        return false;
      }
      // Start interval
      fetchData();
      intervalRef.current = setInterval(fetchData, 10000);
      return true;
    });
  };

  const handleSubmit = async () => {
    const valid = await validateInputs();
    if (valid) {
      setIsSubmitted(true);
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setOriginalLink(link);
    setOriginalToken(token);
    setIsEditing(true);
    if (isRunning) handleStartStop();
  };

  const handleConfirm = async () => {
    const valid = await validateInputs();
    if (valid) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setLink(originalLink);
    setToken(originalToken);
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await disconnect();
    } catch (e) {
      console.error("Error during sign out:", e);
    } finally {
      setIsSigningOut(false);
    }
  };

  const maskedToken = maskToken(token);

  /* Active nav logic */
  const navItems = [
    { key: "dashboard", icon: <FiHome />, label: "Dashboard" },
    { key: "patients", icon: <FiHeart />, label: "Patients" },
    { key: "signout", icon: <FiLogOut />, label: "Sign Out" },
  ];

  /* Renders */
  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return (
          <DashboardContent>
            <ChartHeader>
              <ChartTitle>Real-time Patient Data Monitoring Dashboard</ChartTitle>
            </ChartHeader>

            <ChartContainer>
              {lastUpdateTime && (
                <p
                  style={{
                    textAlign: "right",
                    marginBottom: "10px",
                    fontWeight: "600",
                    color: colors.secondaryText,
                    userSelect: "none",
                  }}
                >
                  Last updated: {formatTime(lastUpdateTime)}
                </p>
              )}
              {chartData.length > 0 && chartData[0].data.length > 0 ? (
                <ResponsiveBar
                  data={chartData[0].data}
                  keys={["Patients"]}
                  indexBy="x"
                  margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
                  padding={0.3}
                  valueScale={{ type: "linear" }}
                  indexScale={{ type: "band", round: true }}
                  colors={({ data }) => riskColors[data.x]}
                  borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Cardiac Risk Level",
                    legendPosition: "middle",
                    legendOffset: 40,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Patient Count",
                    legendPosition: "middle",
                    legendOffset: -40,
                    format: (d) => (Number.isInteger(d) ? d : ""),
                    tickValues: (() => {
                      const maxPatients = Math.max(
                        ...chartData[0].data.map((d) => d.Patients)
                      );
                      if (maxPatients <= 10) return undefined;
                      const interval = Math.ceil(maxPatients / 10);
                      return Array.from(
                        { length: Math.floor(maxPatients / interval) + 1 },
                        (_, i) => i * interval
                      );
                    })(),
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                  animate={true}
                  motionStiffness={90}
                  motionDamping={15}
                  label={(d) => `${d.value}`}
                />
              ) : (
                <NoDataMessage>Data not available</NoDataMessage>
              )}
            </ChartContainer>

            <InputContainer>
              {isSubmitted && !isEditing ? (
                <>
                  <InstructionText>Currently streaming data from:</InstructionText>
                  <p style={{ userSelect: "text", color: colors.secondaryText }}>
                    Link: {link}
                  </p>
                  <p style={{ userSelect: "text", color: colors.secondaryText }}>
                    Token: {maskedToken}
                  </p>

                  <StyledButton onClick={handleEdit}>Edit</StyledButton>

                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <StyledStartButton onClick={handleStartStop}>
                      {isRunning ? "Stop ML Model" : "Start ML Model"}
                    </StyledStartButton>
                  </div>
                </>
              ) : (
                <>
                  <InstructionText>
                    Please provide a <strong>sheetdb.io</strong> link and its
                    authorization bearer token to access the Spreadsheet:
                  </InstructionText>

                  <StyledInput
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Enter Link"
                    autoComplete="off"
                  />
                  <StyledInput
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter Token"
                    autoComplete="off"
                  />

                  {isEditing ? (
                    <div style={{ display: "flex", gap: "12px" }}>
                      <ConfirmButton onClick={handleConfirm}>Confirm</ConfirmButton>
                      <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                    </div>
                  ) : (
                    <StyledButton
                      onClick={handleSubmit}
                      disabled={!link || !token}
                      aria-disabled={!link || !token}
                    >
                      Submit
                    </StyledButton>
                  )}

                  {(!isSubmitted || isEditing) && (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <p style={{ margin: 0, fontWeight: 600, color: colors.primaryText }}>
                          Please format your <strong>Google Spreadsheet</strong> according to
                          the following template:
                        </p>
                        <button
                          onClick={() =>
                            window.open(
                              "https://docs.google.com/spreadsheets/d/18gAB_iD_hw_k0BPA0kM2vMGcrSAGnO470w0ruqwKUEE/edit?usp=sharing",
                              "_blank"
                            )
                          }
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#357bfd",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "14px",
                            transition: "background-color 0.3s",
                            fontWeight: 700,
                            userSelect: "none",
                            whiteSpace: "nowrap",
                            marginLeft: "15px",
                          }}
                          onMouseOver={(e) => (e.target.style.backgroundColor = "#0d60f9")}
                          onMouseOut={(e) => (e.target.style.backgroundColor = "#357bfd")}
                          aria-label="Open example spreadsheet template"
                        >
                          Example Template
                        </button>
                      </div>

                      <ExampleTable aria-label="Spreadsheet data format example">
                        <thead>
                          <tr>
                            <TableHeader narrow aria-hidden="true"></TableHeader>
                            <TableHeader>A</TableHeader>
                            <TableHeader>B</TableHeader>
                            <TableHeader>C</TableHeader>
                            <TableHeader>D</TableHeader>
                            <TableHeader>E</TableHeader>
                            <TableHeader>F</TableHeader>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <TableHeader narrow aria-hidden="true">
                              1
                            </TableHeader>
                            <TableCell bordered top left>
                              HR
                            </TableCell>
                            <TableCell bordered top>BP</TableCell>
                            <TableCell bordered top>SpO2</TableCell>
                            <TableCell bordered top>RESP</TableCell>
                            <TableCell bordered top>TEMP</TableCell>
                            <TableCell bordered top right>Patient_ID</TableCell>
                          </tr>
                          <tr>
                            <TableHeader narrow aria-hidden="true">
                              2
                            </TableHeader>
                            <TableCell bordered left>72</TableCell>
                            <TableCell bordered>120</TableCell>
                            <TableCell bordered>98</TableCell>
                            <TableCell bordered>16</TableCell>
                            <TableCell bordered>36.5</TableCell>
                            <TableCell bordered right>101</TableCell>
                          </tr>
                          <tr>
                            <TableHeader narrow aria-hidden="true">
                              3
                            </TableHeader>
                            <TableCell bordered left>75</TableCell>
                            <TableCell bordered>118</TableCell>
                            <TableCell bordered>97</TableCell>
                            <TableCell bordered>18</TableCell>
                            <TableCell bordered>36.7</TableCell>
                            <TableCell bordered right>102</TableCell>
                          </tr>
                          <tr>
                            <TableHeader narrow aria-hidden="true">
                              4
                            </TableHeader>
                            <TableCell bordered left>...</TableCell>
                            <TableCell bordered>...</TableCell>
                            <TableCell bordered>...</TableCell>
                            <TableCell bordered>...</TableCell>
                            <TableCell bordered>...</TableCell>
                            <TableCell bordered right>...</TableCell>
                          </tr>
                          <tr>
                            <TableHeader narrow aria-hidden="true">
                              5
                            </TableHeader>
                            <TableCell bordered bottom left>...</TableCell>
                            <TableCell bordered bottom>...</TableCell>
                            <TableCell bordered bottom>...</TableCell>
                            <TableCell bordered bottom>...</TableCell>
                            <TableCell bordered bottom>...</TableCell>
                            <TableCell bordered bottom right>...</TableCell>
                          </tr>
                        </tbody>
                      </ExampleTable>
                      <TableNotes>
                        HR: Heart Rate, BP: Systolic Blood Pressure, SpO2: Oxygen
                        Saturation, RESP: Respiration Rate, TEMP: Temperature
                      </TableNotes>
                    </>
                  )}
                </>
              )}
            </InputContainer>
          </DashboardContent>
        );

      case "patients":
        return <Patients patientData={patientData} />;

      default:
        return (
          <DashboardContent>
            <p>Dashboard Content</p>
          </DashboardContent>
        );
    }
  };

  return (
    <>
      <DashboardContainer>
        <Sidebar
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={sidebarVariants}
          transition={{ duration: 0.3 }}
          onHoverStart={() => setIsExpanded(true)}
          onHoverEnd={() => setIsExpanded(false)}
          aria-label="Sidebar navigation"
        >
          <Logo>
            <AnimatePresence initial={false}>
              {isExpanded ? (
                <motion.img
                  key="expanded-logo"
                  src="/varionlogo.png"
                  alt="Varion Logo"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 200 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ height: "auto", marginTop: 10, marginRight: 30 }}
                  draggable={false}
                />
              ) : (
                <motion.img
                  key="collapsed-logo"
                  src="/varionlogoOnly.png"
                  alt="Varion Icon"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 30 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ height: "auto", marginTop: 10 }}
                  draggable={false}
                />
              )}
            </AnimatePresence>
          </Logo>

          <Nav>
            <ul>
              {navItems.map(({ key, icon, label }) => {
                if (key === "signout") {
                  return (
                    <NavItem
                      key={key}
                      onClick={handleSignOut}
                      whileTap={{ scale: 0.95 }}
                      role="button"
                      tabIndex={0}
                      aria-label="Sign Out"
                    >
                      <Icon>{icon}</Icon>
                      <Label
                        variants={labelVariants}
                        initial="collapsed"
                        animate={isExpanded ? "expanded" : "collapsed"}
                      >
                        {label}
                      </Label>
                    </NavItem>
                  );
                }
                return (
                  <NavItem
                    key={key}
                    onClick={() => setActiveComponent(key)}
                    whileTap={{ scale: 0.95 }}
                    className={activeComponent === key ? "active" : ""}
                    role="button"
                    tabIndex={0}
                    aria-current={activeComponent === key ? "page" : undefined}
                    aria-label={label}
                  >
                    <Icon>{icon}</Icon>
                    <Label
                      variants={labelVariants}
                      initial="collapsed"
                      animate={isExpanded ? "expanded" : "collapsed"}
                    >
                      {label}
                    </Label>
                  </NavItem>
                );
              })}
            </ul>
          </Nav>
        </Sidebar>

        <MainContent>{renderComponent()}</MainContent>
      </DashboardContainer>

      <AnimatePresence>
        {modalError && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-modal="true"
            role="alertdialog"
            aria-labelledby="modal-error-title"
            aria-describedby="modal-error-desc"
          >
            <ModalContent
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
            >
              <ErrorIcon aria-hidden="true" />
              <p id="modal-error-desc">{modalError}</p>
              <ModalButton onClick={closeModal} aria-label="Close error modal">
                Got it
              </ModalButton>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dashboard;