import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function List() {
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
      setData(data.created_at);
      console.log(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const movePage = () => {
    navigate(`/form`);
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div>
      created_at : {data}
      <p onClick={movePage}>go form</p>
    </div>
  );
}
export default List;
