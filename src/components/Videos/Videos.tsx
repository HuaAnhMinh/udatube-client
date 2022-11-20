import {useEffect} from "react";
import {useLocation} from "react-router-dom";

const Videos = () => {
  const location = useLocation();
  
  useEffect(() => {
    const title = location.search.split('?title=')[1] || '';
    console.log(title);
  }, [location.search]);

  return (
    <div>
      Videos
    </div>
  );
};

export default Videos;