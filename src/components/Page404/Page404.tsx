import {Link} from "react-router-dom";

const Page404 = () => {
  return (
    <div>
      404 Not Found :(
      <Link to={'/'}>Back to Home</Link>
    </div>
  );
};

export default Page404;