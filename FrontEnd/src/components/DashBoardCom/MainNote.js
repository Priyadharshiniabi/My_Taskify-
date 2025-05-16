import React, { useEffect } from "react";
import { FaHandPointRight } from "react-icons/fa";
import axios from "axios";


const MainNote = ({ notes, setNotes }) => {
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/note/getNote`)
      .then((res) => {
        setNotes(res.data);
      })
      .catch((err) => console.log(err));
  }, [setNotes]);

  return (
    <>
      <div className="scroller">
        <div className="content-note scroller-inner">
          <div className="scroller-con">
          
            <span id="scroller-con-col">
            "The palest ink is better than the best memory."
            </span>
            <br />
            <br />
            "Write what should not be forgotten."
          </div>
          <div className="scroller-con">
          
            "A short notes is better than a long memory."
            <br />
            <br />
           <b> "Your mind is for having ideas, not holding them." </b>
          </div>
          <div className="scroller-con">
           
            "Write hard and clear about what hurts."
            <br />
            <br />
            <span id="scroller-con-col">"Scribble today, succeed tomorrow."</span>
          </div>
          <div className="scroller-con">
           
            "You don't just take notes, you create a map for success."
            <br />
            <br />
            <FaHandPointRight size={30} style={{ marginLeft: "50%" }} />
          </div>
          {notes.map((eachNote) => (
            <textarea
              value={eachNote.noteText}
              id="dash-note-con"
              key={eachNote.id}
              readOnly
            ></textarea>
          ))}
        </div>
        
      </div>
    </>
  );
};

export default MainNote;
