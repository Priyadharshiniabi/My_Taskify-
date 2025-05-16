import React, { useEffect } from "react";
import { FaHandPointDown } from "react-icons/fa6";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";

const MainTodo = ({ todo, setTodo }) => {
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/todo/getTodo`)
      .then((res) => {
        setTodo(res.data);
      })
      .catch((err) => console.log(err));
  }, [setTodo]);

  return (
    <div className="dash-todo-con">
      <div className=" todo-scroll">
        <div className="content-todo scroller-inner">
          <div className="scroller-con">
           
            <span id="scroller-con-col">"You don’t have to see the whole staircase, just take the first step."</span>
            <br />
            <br />
           Your future is created by what you do today, not tomorrow.
          </div>
          <div className="scroller-con">
            
          Dream big. Start small. Act now.
            <br />
            <br />
           <b>Start where you are. Use what you have. Do what you can.</b> 
          </div>
         
          <div className="scroller-con">
           
         Action is the foundational key to all success.
            <br />
            <br />
            <span id="scroller-con-col">
              " It always seems impossible until it’s done"
            </span>
          </div>
          <div className="scroller-con">
            
           
           The secret of getting ahead is getting started."
            <br />
            <br />
            <FaHandPointDown size={30} style={{ marginLeft: "45%" }} />
       
          </div>
         
        </div>
      </div>
      <ul id="lists">
        {todo.length === 0 && <h3 id="no-todo">No Remainders</h3>}
        {todo.map((todo) => {
          return (
            <li key={todo.todoId}>
              <label htmlFor="" className="item-name">
                <input type="checkbox" checked={todo.status} readOnly />
                {todo.title}
              </label>
              <button id="del-bt">
                <AiFillDelete size={20} color="#FF6969" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MainTodo;
