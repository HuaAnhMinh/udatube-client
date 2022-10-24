import {InputBase, Paper} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = () => {
  return (
    <Paper component="form" sx={{ p: '5px 4px', display: 'flex', alignItems: 'center' }}>
      <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
      <InputBase sx={{ ml: 1, flex: 1 }} placeholder={"Search videos or try channel:Alan Walker to search channels"} fullWidth />
    </Paper>
  );
};

export default SearchBar;