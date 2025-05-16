import React, { useEffect } from "react";
import { FaHandPointRight } from "react-icons/fa";
import axios from "axios";

const MainTask = ({ tasks, setTasks }) => {
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/task/getTask`)
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => console.log(err));
  }, [setTasks]);

  return (
    <div className="scroller">
      <div className="content-task scroller-inner">
        <div className="scroller-con">
         
          <span id="scroller-con-col">" Master Your Day With Tasks."</span>
          <br />
          <br />
          The first draft is just you telling yourself the story.
        </div>
        <div className="scroller-con">
        You can always edit a bad page. You can’t edit a blank page.
         
          <br />
          <br />
         <b> Start writing, no matter what. The water does not flow until the faucet is turned on.</b>
        </div>
        <div className="scroller-con">
         
        If it is possible to cut a word out, always cut it out.
          <br />
          <br />
          <span id="scroller-con-col">" Your task's in safe hands." </span>
        </div>
        <div className="scroller-con">
          
        Don’t tell me the moon is shining; show me the glint of light on broken glass
          <br />
          <br />
          <FaHandPointRight size={30} style={{ marginLeft: "50%" }} />
        </div>
        {tasks.map((eachTask) => (
          <div id="dash-task-con" key={eachTask.id}>
            <h4>Task Name : {eachTask.task.taskName}</h4>
            <h4>Priority : {eachTask.task.priority}</h4>
            <h4>Deadline : {eachTask.task.deadline}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainTask;
