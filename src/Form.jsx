import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Form() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const search = async () => {
    const url = "https://api.github.com/repos/yamdeng/learn-react";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      setData(data.archive_url);
      console.log(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const movePage = () => {
    navigate(`/`);
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div>
      archive_url : {data}
      <p onClick={movePage}>go home</p>
    </div>
  );
}

export default Form;
