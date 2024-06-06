import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ setSearchData }) => {
  const handleInputChange = (e) => {
    setSearchData(e.target.value);
  };

  return (
    <form>
      <TextField
        id="search-bar"
        label="Buscar"
        variant="outlined"
        size="small"
        onChange={handleInputChange}
      />
      <IconButton type="submit" aria-label="search">
        <SearchIcon />
      </IconButton>
    </form>
  );
};

export default SearchBar;