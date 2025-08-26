import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiRefreshCw } from "react-icons/fi";

const Container = styled.section`
  max-width: 1100px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  user-select: none;
`;

const HeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  flex: 1 1 auto;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1 1 300px;
  max-width: 400px;
  display: flex;
  align-items: center;
  border: 2px solid #cbd5e1;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  transition: border-color 0.3s;
  &:focus-within {
    border-color: #6366f1;
  }
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  padding-left: 0.75rem;
  font-size: 1rem;
  width: 100%;
  color: #334155;
  font-weight: 500;

  &::placeholder {
    color: #94a3b8;
  }
`;

const IconSearch = styled(FiSearch)`
  flex-shrink: 0;
  color: #64748b;
  font-size: 1.25rem;
`;

const ButtonRefresh = styled.button`
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.55rem 1.25rem;
  font-weight: 600;
  border-radius: 40px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.25s;

  &:hover {
    background-color: #4f46e5;
  }

  &:focus-visible {
    outline: 3px solid #4f46e5;
    outline-offset: 2px;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  user-select: none;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1.3rem;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 9999px;
  border: 2px solid transparent;
  cursor: pointer;
  background: ${({ active }) => (active ? "#4f46e5" : "#e0e7ff")};
  color: ${({ active }) => (active ? "#f3f4f6" : "#4f46e5")};
  transition: background-color 0.3s, color 0.3s;

  &:hover:not(:disabled) {
    background-color: ${({ active }) =>
      active ? "#4338ca" : "#c7d2fe"};
  }
`;

const SortContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 0.5rem;
  user-select: none;
`;

const SortCheckbox = styled.input`
  cursor: pointer;
  width: 18px;
  height: 18px;
`;

const SortLabel = styled.label`
  font-weight: 600;
  color: #4f46e5;
  cursor: pointer;
  user-select: none;
`;

const LastUpdate = styled.p`
  text-align: center;
  font-size: 0.9rem;
  color: #64748b;
  margin-top: 0.5rem;
  font-style: italic;
  user-select: none;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 14px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.05);
`;

const TableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(120px, 1fr));
  gap: 10px;
  min-width: 700px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(4, minmax(100px, 1fr));
    min-width: 400px;
  }
`;

const TableHeader = styled.div`
  font-weight: 700;
  color: #64748b;
  background-color: #f8fafc;
  padding: 14px 12px;
  border-radius: 10px;
  text-align: center;
  user-select: none;

  @media (max-width: 640px) {
    padding: 10px 8px;
  }
`;

const TableCell = styled(motion.div)`
  background-color: ${({ riskColor }) => riskColor ? riskColor : "#f8fafc"};
  padding: 12px 10px;
  border-radius: 10px;
  text-align: center;
  font-weight: 500;
  color: #1e293b;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e0e7ff;
  }

  @media (max-width: 640px) {
    font-size: 0.85rem;
    padding: 10px 6px;
  }
`;

const getRiskColor = (riskLevel) => {
  switch (riskLevel) {
    case "High Risk":
      return "rgba(244, 67, 54, 0.15)";
    case "Medium Risk":
      return "rgba(255, 235, 59, 0.15)";
    case "Low Risk":
      return "rgba(76, 175, 80, 0.15)";
    default:
      return "#f8fafc";
  }
};

const Patients = ({ patientData, onRefresh }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [sortByRiskLevel, setSortByRiskLevel] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState("Not available");

  useEffect(() => {
    setPatients(patientData);
    if (patientData.length > 0 && patientData[0].lastUpdated) {
      setLastUpdateTime(patientData[0].lastUpdated);
    }
  }, [patientData]);

  const filteredAndSortedPatients = patients
    .filter(
      (p) =>
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (riskFilter === "All" || p.riskLevel === riskFilter)
    )
    .sort((a, b) => {
      if (sortByRiskLevel) {
        return b.cardiacProba - a.cardiacProba;
      }
      return 0;
    });

  return (
    <Container aria-label="Patient data table">
      <HeaderRow>
        <Title>Patient Data</Title>
        <SearchWrapper>
          <IconSearch aria-hidden="true" />
          <SearchInput
            aria-label="Search patients by ID"
            type="search"
            placeholder="Search Patient ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            spellCheck={false}
          />
        </SearchWrapper>
        <ButtonRefresh
          aria-label="Refresh patient data"
          onClick={() => onRefresh && onRefresh()}
        >
          <FiRefreshCw />
          Refresh
        </ButtonRefresh>
      </HeaderRow>

      <FiltersContainer role="group" aria-label="Risk level filters">
        {["All", "Low Risk", "Medium Risk", "High Risk"].map((level) => (
          <FilterButton
            key={level}
            active={riskFilter === level}
            onClick={() => setRiskFilter(level)}
            aria-pressed={riskFilter === level}
          >
            {level}
          </FilterButton>
        ))}
      </FiltersContainer>

      <SortContainer>
        <SortCheckbox
          type="checkbox"
          id="sortByRisk"
          checked={sortByRiskLevel}
          onChange={(e) => setSortByRiskLevel(e.target.checked)}
        />
        <SortLabel htmlFor="sortByRisk">
          Sort by highest Cardiac Probability
        </SortLabel>
      </SortContainer>

      <LastUpdate>Last Updated: {lastUpdateTime}</LastUpdate>

      <TableWrapper>
        <TableGrid role="table" aria-label="Patient information">
          <TableHeader role="columnheader" tabIndex={-1}>Patient ID</TableHeader>
          <TableHeader role="columnheader" tabIndex={-1}>HR</TableHeader>
          <TableHeader role="columnheader" tabIndex={-1}>BP</TableHeader>
          <TableHeader role="columnheader" tabIndex={-1}>SpO₂</TableHeader>
          <TableHeader role="columnheader" tabIndex={-1}>Resp</TableHeader>
          <TableHeader role="columnheader" tabIndex={-1}>Temp (°C)</TableHeader>
          <TableHeader role="columnheader" tabIndex={-1}>Risk Level</TableHeader>

          <AnimatePresence>
            {filteredAndSortedPatients.map((patient) => (
              <React.Fragment key={patient.id}>
                <TableCell
                  role="cell"
                  tabIndex={0}
                  riskColor={getRiskColor(patient.riskLevel)}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.25 }}
                >
                  {patient.id}
                </TableCell>
                <TableCell role="cell" tabIndex={0}>
                  {patient.HR}
                </TableCell>
                <TableCell role="cell" tabIndex={0}>
                  {patient.BP}
                </TableCell>
                <TableCell role="cell" tabIndex={0}>
                  {patient.SpO2}
                </TableCell>
                <TableCell role="cell" tabIndex={0}>
                  {patient.RESP}
                </TableCell>
                <TableCell role="cell" tabIndex={0}>
                  {patient.TEMP}
                </TableCell>
                <TableCell role="cell" tabIndex={0}>
                  {patient.riskLevel}
                </TableCell>
              </React.Fragment>
            ))}
          </AnimatePresence>
        </TableGrid>
      </TableWrapper>
    </Container>
  );
};

export default Patients;
