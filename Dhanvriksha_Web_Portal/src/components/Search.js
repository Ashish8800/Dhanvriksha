import React, { useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

const Search = (props) => {
  const [nores, setNoRes] = useState(false);
  const [isfocused, setIsFocused] = useState(false);
  const handleOnSearch = (string, results) => {
    console.log("results :>> ", results);
  };

  const handleOnSelect = (item) => {
    props.onSelect(item.id);
  };

  const handleOnClear = () => {
    props.onClear();
  };

  const handleOnFocus = () => {
    // setIsFocused(true);
    console.log("Focused");
  };
  const formatResult = (item) => {
    return (
      <div key={item.name + "" + item.id}>
        <span style={{ display: "block", textAlign: "left" }}>{item.name}</span>
      </div>
    );
  };
  return (
    <>
      {/* {isfocused.toString()} */}
      <ReactSearchAutocomplete
        items={props.events}
        showClear
        onSearch={handleOnSearch}
        onSelect={handleOnSelect}
        onFocus={handleOnFocus}
        onClear={handleOnClear}
        placeholder={nores ? "No results found" : !isfocused ? props.placeHolder : ""}
        styling={{
          height: "55px",
          zIndex: 100,
          borderRadius: "8px",
          boxShadow: "none",
          placeholderColor: "black",
        }}
        minMatchCharLength={4}
        formatResult={formatResult}
      />
    </>
  );
};

export default Search;
