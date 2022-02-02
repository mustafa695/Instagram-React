import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { FaSpinner } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import "./Style.scss";

const AutoComplete = ({ data, searchUsers, searchInput, setSearchResults }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [suggestionsActive, setSuggestionsActive] = useState(false);
  const [value, setValue] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const query = e.target.value.toLowerCase();
    setLoader(true);
    setValue(query);
    if (query.length) {
      const filterSuggestions = data.filter(
        (suggestion) => suggestion.name.toLowerCase().indexOf(query) > -1
      );
      setSuggestions(filterSuggestions);
      setSuggestionsActive(true);
      if (value) {
        db.collection("users")
          .where("username", ">=", value)
          .where("username", "<=", value + "\uf8ff")
          .get()
          .then((res) => {
            setLoader(false);
            let data = res.docs.map((i) => {
              return {
                id: i.data().uid,
                name: i.data().username,
                icon: i.data().avatar,
              };
            });
            setSearchResults(data);
          })
          .catch((err) => {
            console.log(err);
            setLoader(false);
          });
      }
    } else {
      setSuggestionsActive(false);
    }
  };

  const handleClick = (e, ind) => {
    navigate(`/profile/${suggestions[ind].id}`);
    setSuggestions([]);
    setValue(e.target.innerText);
    setSuggestionsActive(false);
  };

  const handleKeyDown = (e) => {
    // UP ARROW
    if (e.keyCode === 38) {
      if (suggestionIndex === 0) {
        return;
      }
      setSuggestionIndex(suggestionIndex - 1);
    }
    // DOWN ARROW
    else if (e.keyCode === 40) {
      if (suggestionIndex === suggestions.length - 1) {
        return;
      }
      setSuggestionIndex(suggestionIndex + 1);
    }
    // ENTER
    else if (e.keyCode === 13) {
      setValue(suggestions[suggestionIndex].name);
      setSuggestionIndex(0);
      setSuggestionsActive(false);
      navigate(`/profile/${suggestions[suggestionIndex].id}`);
    }
  };

  const Suggestions = () => {
    return (
      <ul className="suggestions">
        {suggestions.length
          ? suggestions.map((suggestion, index) => {
              return (
                <li
                  className={index === suggestionIndex ? "active" : ""}
                  key={index}
                  onClick={(e) => handleClick(e, index)}
                >
                  <img
                    src={suggestion.icon}
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "55%",
                      objectFit: "cover",
                    }}
                  />{" "}
                  {suggestion.name}
                </li>
              );
            })
          : []}
         
      </ul>
    );
  };

  return (
    <div className="autocomplete">
      <input
        type="text"
        id="autoInput"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search"
      />
      {suggestionsActive && <Suggestions />}
      {value && (
        <span
          onClick={() => {
            setValue("");
            setSuggestions([]);
          }}
        >
          {loader ? (
            <FaSpinner className="spinLoader" size={16} />
          ) : (
            <IoMdCloseCircle size={18} />
          )}
        </span>
      )}
    </div>
  );
};

export default AutoComplete;
