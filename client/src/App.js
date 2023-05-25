import './App.css';
import Papa from 'papaparse';
import { useState, useEffect } from 'react';
import { formatDate, dateDifferenceInDays } from './utils/formatDateUtils';
import { Row } from './components/Row/Row';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'

function App() {

  const [data, setData] = useState([]);
  const [results, setResults] = useState([]);

  const onSubmitHandler = (e) => {
    e.preventDefault()
    console.log("show")
  }

  const transform = (val, column) => {
    if (val == "NULL") {
      val = new Date().toISOString().split('T')[0]
    }
    if (column == "DateTo" || column == "DateFrom") {
      try {
        return formatDate(new Date(val))
      } catch {
        console.log(`Not a recognized Date Format: ${val}`)
      }
    }
    return val;
  }

  const changeHandler = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      delimiter: ", ",
      transform: transform,
      skipEmptyLines: true,
      complete: function (results) {
        setData(results.data)
      },
    });
  };

  const setOfProjects = (data) => {
    const projects = new Set()
    data?.map(row => projects.add(row.ProjectID))
    return projects
  }

  const projects = setOfProjects(data)

  const makeProjectsObject = () => {
    let projectsObject = Object.fromEntries(projects.entries())
    for (const projectID of Object.values(projectsObject)) {
      let employeesByProjectArray = data?.filter(row => row.ProjectID == projectID)
      let n = employeesByProjectArray.length;
      const pairs = getPairsByProject(employeesByProjectArray, n)
      
      for (const pair in pairs) {
        let first = data?.filter(row => row.EmpID == pairs[pair][0] && projectID == row.ProjectID)
        let second = data?.filter(row => row.EmpID == pairs[pair][1] && projectID == row.ProjectID)
        const daysWorkedTogether = findDaysWorkedTogether(first[0].DateFrom, second[0].DateFrom, first[0].DateTo, second[0].DateTo)
        
        if (projectsObject[projectID].DaysWorked < daysWorkedTogether || !projectsObject[projectID].DaysWorked) {
          projectsObject = { ...projectsObject, [projectID]:{
            FirstEmpID: first[0].EmpID,
            SecondEmpID: second[0].EmpID,
            projectID,
            daysWorked: daysWorkedTogether
          }}
        } 
      }
    }

    clearSoloProjects(projectsObject)

    return projectsObject
  }

  const clearSoloProjects = (objectWithProjects) => {
    for (let x in objectWithProjects) {
      if (x == objectWithProjects[x]) {
        delete objectWithProjects[x]
      }
    }
  }

  const findDaysWorkedTogether = (firstDateFrom, secondDateFrom, firstDateTo, secondDateTo) => {
    const range1Start = new Date(firstDateFrom);
    const range1End = new Date(firstDateTo);

    const range2Start = new Date(secondDateFrom);
    const range2End = new Date(secondDateTo);

    if (range1Start < range2End && range2Start < range1End) {
      let daysWorked = dateDifferenceInDays(Math.max(range1Start, range2Start), Math.min(range1End, range2End))
      return daysWorked
    }
    return 0
  }

  const hasPair = (array, a, b) => {
    let pairStatus = false;
    for (let pair of array) {
      if (pair.includes(a) && pair.includes(b)) {
        pairStatus = true;
      }
    }
    return pairStatus;
  }

  const getPairsByProject = (arr, n) => {
    let pairs = []
    for (let i = 0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        if (i != j && !hasPair(pairs, arr[i].EmpID, arr[j].EmpID)) {
          pairs.push([arr[i].EmpID, arr[j].EmpID])
        }
      }
    }

    if (pairs.length < 1) {
      return;
    }

    return pairs
  }

  useEffect(() => {
    const bestPairsByProjectObject = makeProjectsObject()
    setResults(bestPairsByProjectObject);
  }, [data]);

  console.log(results)

  return (
    <>
      <div>
        <form onSubmit={onSubmitHandler}>
          <input
            type="file"
            name="file"
            accept=".csv"
            onChange={changeHandler}
            style={{ display: "block", margin: "10px auto" }}
          />
          <button>Show Data</button>
        </form>

        <TableContainer>
          <Table variant='simple'>
            <TableCaption>Longest period of time worked together by pair</TableCaption>
            <Thead>
              <Tr>
                <Th>Employee ID #1</Th>
                <Th>Employee ID #2</Th>
                <Th>Project ID</Th>
                <Th>Days worked</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.values(results).map((results) => (
                <Row
                  key={results.projectID}
                  {...results} />))}

            </Tbody>
            {/* <Tfoot>
              <Tr>
                <Th>To convert</Th>
                <Th>into</Th>
                <Th isNumeric>multiply by</Th>
              </Tr>
            </Tfoot> */}
          </Table>
        </TableContainer>
      </div>


    </>
  );
}

export default App;
