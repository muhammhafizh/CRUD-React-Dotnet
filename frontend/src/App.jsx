import { useState, useEffect, useRef } from "react";
import "./App.css";
import { AxiosInstance } from "./Fetch";

function App() {
  const [postEditData, setPostEditData] = useState({
    ID: 0,
    NAME: null,
    COMPLETE: null,
  });
  const [data, setData] = useState([]);
  const [changeData, setChangeData] = useState(false);
  const postData = useRef(null);

  const AddPost = async () => {
    await AxiosInstance.post("/todoitems", {
      name: postData.current.value,
      isComplete: false,
    });
  };

  const DeletePost = async (id) => {
    await AxiosInstance.delete(`/todoitems/${id}`).then((res) =>
      setChangeData(true)
    );
  };

  const CompletePost = async (data) => {
    await AxiosInstance.put(`/todoitems/${data.id}`, {
      name: data.name,
      isComplete: !data.isComplete,
    }).then((res) => setChangeData(true));
  };

  const EditPost = (dta) => {
    setPostEditData({
      ID: dta.id,
      NAME: dta.name,
      COMPLETE: dta.isComplete,
    });
  };

  const SubmitEdit = async () => {
    await AxiosInstance.put(`/todoitems/${postEditData.ID}`, {
      name: postEditData.NAME,
      isComplete: postEditData.COMPLETE,
    }).then((res) => setChangeData(true));
  };

  useEffect(() => {
    let getData = true;

    if (getData) {
      AxiosInstance.get("/todoitems").then((res) => setData(res.data));
    }

    setChangeData(false);

    return () => {
      getData = false;
    };
  }, [changeData]);

  return (
    <div className="App">
      <form onSubmit={AddPost}>
        <input type="text" className="input-form" ref={postData} required />
        <button type="submit" className="btn-form">
          Submit
        </button>
      </form>
      {data?.map((dta) => {
        return (
          <ul key={dta.id}>
            <li>
              <input
                type="checkbox"
                defaultChecked={dta.isComplete}
                onChange={() => CompletePost(dta)}
              />
              {dta.id === postEditData.ID ? (
                <form className="edit-data" onSubmit={SubmitEdit}>
                  <input
                    type="text"
                    value={postEditData.NAME}
                    name="NAME"
                    onChange={(e) =>
                      setPostEditData({
                        ...postEditData,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </form>
              ) : (
                <p
                  style={
                    dta.isComplete ? { textDecoration: "line-through" } : {}
                  }
                >
                  {dta.name}
                </p>
              )}
              <button onClick={() => DeletePost(dta.id)} className="btn-delete">
                Delete
              </button>
              <button onClick={() => EditPost(dta)} className="btn-edit">
                Edit
              </button>
            </li>
          </ul>
        );
      })}
    </div>
  );
}

export default App;
