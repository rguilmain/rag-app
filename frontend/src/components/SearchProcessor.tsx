import { useState } from "react";
import axios from "axios";
import Button from "./Button";

const SearchProcessor = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  const handleQueryChange = (e: any) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/search?q=${query}`
      );
      setAnswer(response.data.answer);
    } catch (error) {
      console.error("Error processing query:", error);
    }
  };

  return (
    <div>
      <input type="text" value={query} onChange={handleQueryChange} />
      <Button onClick={handleSearch}>Search</Button>
      <p>Answer: {answer}</p>
    </div>
  );
};

export default SearchProcessor;
