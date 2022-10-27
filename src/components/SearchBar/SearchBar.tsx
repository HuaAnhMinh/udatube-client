import {InputBase, Paper} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {FormEvent, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

const SearchBar = () => {
  const [searchText, setSearchText] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  const onHandleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchText.startsWith('username:')) {
      return navigate(`/users?username=${searchText.split('username:')[1]}`);
    }
    return navigate(`/videos?title=${searchText}`);
  };

  useEffect(() => {
    setSearchText(location.search);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Paper
      component="form"
      sx={{ p: '5px 4px', display: 'flex', alignItems: 'center' }}
      onSubmit={onHandleSearch}
    >
      <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={"Search videos or try username:Alan Walker to search users"}
        fullWidth
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </Paper>
  );
};

export default SearchBar;