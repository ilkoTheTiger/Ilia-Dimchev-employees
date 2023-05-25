import './App.css';
import Papa from 'papaparse';

function App() {

  // const NULL = new Date()
  // console.log(NULL.toISOString().split('T')[0])

  const onSubmitHandler = (e) => {
    e.preventDefault()
    console.log(e.files)
  }

const transform = (val) => {
    if (val == "NULL") {
      val = new Date().toISOString().split('T')[0]
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
    },
  });
};

return (
  <>
    <div>
      {/* File Uploader */}
      <form onSubmit={onSubmitHandler}>
        <input
          type="file"
          name="file"
          accept=".csv"
          onChange={changeHandler}
          style={{ display: "block", margin: "10px auto" }}
        />
        <button>Send</button>
      </form>
    </div>
  </>
);
}

export default App;
