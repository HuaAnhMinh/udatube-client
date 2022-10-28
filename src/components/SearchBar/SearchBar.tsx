import {InputBase, Paper} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {FormEvent, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";

const SearchBar = () => {
  const [searchText, setSearchText] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  const onHandleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchText.startsWith('username:')) {
      if (location.search === `?username=${searchText.split('username:')[1]}`) {
        return navigate(0);
      }
      return navigate(`/users?username=${searchText.split('username:')[1]}`);
    }
    if (location.search === `/videos?title=${searchText}`) {
      return navigate(0);
    }
    return navigate(`/videos?title=${searchText}`);
  };

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