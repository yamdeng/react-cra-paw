import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Form() {
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
      setData(data.head.description);
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
      description : {data}
      <p onClick={movePage}>go home</p>
    </div>
  );
}

export default Form;
