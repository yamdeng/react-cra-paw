import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const search = async () => {
    const url = "https://nam.veta.naver.com/gfp/v1?u=p_main_webtoon";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      setData(data.adUnit);
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

  const currentDate = "";

  return (
    <div>
      adUnit : {data}, current date : {currentDate}
      <p onClick={movePage}>go list</p>
    </div>
  );
}
export default Home;
