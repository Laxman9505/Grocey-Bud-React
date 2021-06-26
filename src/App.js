import { render } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  return JSON.parse(localStorage.getItem("list"));
};
const App = () => {
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [id, setEditID] = useState(null);
  const [list, setList] = useState(getLocalStorage());
  const [alert, setAlert] = useState({ show: false, type: "", msg: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      //set Alert
      showAlert(true, "danger", "please enter the value");
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === id) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName("");
      setIsEditing(false);
      setEditID(null);
      showAlert(true, "success", "value changed");
    } else {
      showAlert(true, "success", "item Added to the list");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setName(specificItem.title);
    setIsEditing(true);
    setEditID(id);
  };
  const removeItemFromList = (id) => {
    setList(list.filter((item) => item.id !== id));
    showAlert(true, "danger", "item removed");
  };
  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, msg, type });
  };
  const clearItems = () => {
    showAlert(false, "danger", "empty list");
    setList([]);
  };
  return (
    <>
      <section className="section-center">
        <form className="grocery-form" onSubmit={handleSubmit}>
          <Alert {...alert} removeItem={showAlert} list={list} />
          <h3>Grocery Bud</h3>
          <div className="form-control">
            <input
              type="text"
              className="grocery"
              placeholder="Enter the items"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
            <button className="submit-btn" type="submit">
              {isEditing ? "Edit" : "Submit"}
            </button>
          </div>
        </form>
        {list.length > 0 && (
          <div className="grocery-container">
            <List
              items={list}
              removeItemFromList={removeItemFromList}
              editItem={editItem}
            />
            <button className="clear-btn" onClick={clearItems}>
              clear items
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default App;
