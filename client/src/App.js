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
  Tfoot,
} from '@chakra-ui/react'

function App() {

  const [data, setData] = useState([]);
  const [results, setResults] = useState([]);
  let totalDays = 0;

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
    if (event.target.files[0]) {
      Papa.parse(event.target.files[0], {
        header: true,
        delimiter: ", ",
        transform: transform,
        skipEmptyLines: true,
        complete: function (results) {
          setData(results.data)
        },
      });
    } else {
      return
    }
  };

  const setOfProjects = (data) => {
    const projects = new Set()
    data?.map(row => projects.add(row.ProjectID))
    return projects
  }

  const getAllCommonProjectsByPair = (firstEmp, secondEmp) => {
    let projectsObject = Object.fromEntries(setOfProjects(data).entries())
    let projectsWithEmployees = []
    for (const projectID of Object.values(projectsObject)) {
      let employeesByProjectArray = data?.filter(row => row.ProjectID == projectID && (row.EmpID == firstEmp || row.EmpID == secondEmp))
      projectsWithEmployees.push(employeesByProjectArray)
    }

    projectsWithEmployees = projectsWithEmployees.filter(x => x.length > 1)
    let commonProjects = []
    let currentProject = {}
    for (let pair in projectsWithEmployees) {
      currentProject = {
        FirstEmpID: projectsWithEmployees[pair][0].EmpID,
        SecondEmpID: projectsWithEmployees[pair][1].EmpID,
        ProjectID: projectsWithEmployees[pair][1].ProjectID,
        DaysWorked: findDaysWorkedTogether(
          projectsWithEmployees[pair][0].DateFrom,
          projectsWithEmployees[pair][1].DateFrom,
          projectsWithEmployees[pair][0].DateTo,
          projectsWithEmployees[pair][1].DateTo,
        )
      }
      commonProjects.push(currentProject)
      // commonProjects = {...commonProjects, ...}
    }
    // findDaysWorkedTogether
    return commonProjects
  }

  const pairToString = (first, second) => {
    return `${first}-${second}`
  }

  const makeProjectsObject = () => {
    let projectsObject = Object.fromEntries(setOfProjects(data).entries())
    for (const projectID of Object.values(projectsObject)) {
      let employeesByProjectArray = data?.filter(row => row.ProjectID == projectID)
      let n = employeesByProjectArray.length;
      const pairs = getPairsByProject(employeesByProjectArray, n)
      for (const pair in pairs) {
        let first = data?.filter(row => row.EmpID == pairs[pair][0] && projectID == row.ProjectID)
        let second = data?.filter(row => row.EmpID == pairs[pair][1] && projectID == row.ProjectID)
        const daysWorkedTogether = findDaysWorkedTogether(first[0].DateFrom, second[0].DateFrom, first[0].DateTo, second[0].DateTo)

        if (daysWorkedTogether) {
          if (projectsObject[projectID] == projectID) {
            projectsObject = {
              ...projectsObject, [projectID]: [{
                FirstEmpID: first[0].EmpID,
                SecondEmpID: second[0].EmpID,
                projectID,
                daysWorked: daysWorkedTogether
              }]
            }
          } else {
            projectsObject[projectID].push(
              {
                FirstEmpID: first[0].EmpID,
                SecondEmpID: second[0].EmpID,
                projectID,
                daysWorked: daysWorkedTogether
              }
            )
          }
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
    const objectWithPairsPerProject = makeProjectsObject()
    let recordDaysWorkedTogether = 0
    let firstEmp, secondEmp = undefined


    let pairs = {}
    for (const array of Object.values(objectWithPairsPerProject)) {
      for (const project of array) {
        let key = pairToString(project.FirstEmpID, project.SecondEmpID)
        if (!pairs[key]) {
          pairs[key] = project.daysWorked
        } else {
          pairs[key] += project.daysWorked
        }
      }
    }

    if (Object.keys(pairs).length) {
      [firstEmp, secondEmp] = Object.keys(pairs).reduce(function (a, b) { return pairs[a] > pairs[b] ? a : b }).split('-')
    }

    for (const project in objectWithPairsPerProject) {
      if (recordDaysWorkedTogether < objectWithPairsPerProject[project].daysWorked) {
        recordDaysWorkedTogether = objectWithPairsPerProject[project].daysWorked
      }
    }


    setResults(getAllCommonProjectsByPair(firstEmp, secondEmp));
  }, [data]);

  return (
    <>
      <div className="appContainer">
        <input
          type="file"
          name="file"
          accept=".csv"
          onChange={changeHandler}
          style={{ display: "block", margin: "10px auto" }}
        />

        {results.length ? <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>Employee ID #1</Th>
                <Th>Employee ID #2</Th>
                <Th>Project ID</Th>
                <Th>Days worked</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.values(results).map((result) => (
                totalDays += Number(result.DaysWorked),
                <Row
                  key={`${result.ProjectID}-${result.DaysWorked}`}
                  {...result} />
              )

              )}

            </Tbody>
            <Tfoot>
              <Tr>
                <Th></Th>
                <Th></Th>
                <Th></Th>
                <Th></Th>
              </Tr>
            </Tfoot>
            <TableCaption>Total period of time worked together for <strong>{totalDays}</strong></TableCaption>
          </Table>
        </TableContainer> :
          <p>No common projects.</p>}
      </div>


    </>
  );
}

export default App;
