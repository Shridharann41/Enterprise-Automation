import { useEffect, useState } from "react";
import ModuleCss from "./App.module.css";
import Card from "./components/Card/Card";
import Search from "./components/Search/Search";
import { getUsers } from "./services/userServices";

function App() {
  //state initialization
  const [users, setUsers] = useState([]); //state for storing user data
  const [loading, setLoading] = useState(true); //state for loading status
  const [error, setError] = useState(null); //state for error handling
  const [value, setValue] = useState(""); //state for search input
  const [filteredArray, setFilteredArray] = useState([]); //state for filtered user data
  const [key, setKey] = useState(""); //state for selected filter key

  //Function to handle search input change
  const handleChange = (e) => {
    setValue(e.target.value);
    const newArray = users.filter((ele) => {
      if (key === "company")
        return String(ele[key].name)
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      if (key === "address")
        return String(ele[key].city)
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      return String(ele[key])
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    setFilteredArray(newArray);
  };

  //effect hook to fetch user data on component mount
  useEffect(() => {
    getUsers()
      .then((res) => {
        setUsers(res.data);
        setFilteredArray(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setUsers(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  //function to generate options for select dropdown
  const generateOptions = () => Object.keys(users[0]);


  //function to check if select dropdown needs to be disabled
  const isDisabled = () => {
    return !key ? true : key === "Select" ? true : false;
  };

  //component rendering
  return (
    <div className="App">
      <div className={ModuleCss.navContainer}>
        <select
          className={ModuleCss.select}
          value={key}
          onChange={(e) => setKey(e.target.value)}
        >
          <option className={ModuleCss.option}>Select</option>
          {users.length &&
            generateOptions().map((option) => (
              <option key={option} className={ModuleCss.option}>
                {option}
              </option>
            ))}
        </select>
        <Search
          value={value}
          handleChange={handleChange}
          disabled={isDisabled()}
        />
      </div>
      <Card
        data={value ? filteredArray : users}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default App;
