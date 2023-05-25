import './App.css';
import Papa from 'papaparse';
import { useState } from 'react';
import { formatDate } from './utils/formatDateUtils';

function App() {

  const [data, setData] = useState([]);

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
        console.log(`Not a Date ${val}`)
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
        console.log(results.data)
        setData(results.data)
      },
    });
  };

  console.log(data)

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
      </div>
    </>
  );
}

export default App;
