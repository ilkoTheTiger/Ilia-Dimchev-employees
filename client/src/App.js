import './App.css';
import Papa from 'papaparse';

function App() {

  // const NULL = new Date()
  // console.log(NULL.toISOString().split('T')[0])

  const onSubmitHandler = (e) => {
    e.preventDefault()
    console.log(e.files)
  }

  const changeHandler = (event) => {
    console.log(event.target.files[0])
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
