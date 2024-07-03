import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function List() {
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
      setData(data.requestId);
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
      requestId : {data}
      <p onClick={movePage}>go form</p>
    </div>
  );
}
export default List;
