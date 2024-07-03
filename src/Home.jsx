import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
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
      setData(data.git_url);
      console.log(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const movePage = () => {
    navigate(`/list`);
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div>
      git_url : {data}
      <p onClick={movePage}>go list</p>
    </div>
  );
}
export default Home;
