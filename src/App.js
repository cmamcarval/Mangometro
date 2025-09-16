import React, { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    question1: "",
    question2: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thanks! Your answers have been submitted.");
  };

  return (
    <div className="container">
      <div className="header">
        <span className="logo" role="img" aria-label="mango">🥭</span>
        <h1>Mangómetro</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="mango-form">
        <div className="question-block">
          <p className="question-text">Qual é o nível de doçura da manga?</p>
          <div className="radio-group">
            <div className="radio-item">
              <input type="radio" id="q1-1" name="question1" value="1" onChange={handleChange} required />
              <label htmlFor="q1-1">Muito ácida</label>
            </div>
            <div className="radio-item">
              <input type="radio" id="q1-2" name="question1" value="2" onChange={handleChange} />
              <label htmlFor="q1-2">Pouco doce</label>
            </div>
            <div className="radio-item">
              <input type="radio" id="q1-3" name="question1" value="3" onChange={handleChange} />
              <label htmlFor="q1-3">Doce</label>
            </div>
            <div className="radio-item">
              <input type="radio" id="q1-4" name="question1" value="4" onChange={handleChange} />
              <label htmlFor="q1-4">Muito doce</label>
            </div>
          </div>
        </div>

        <div className="question-block">
          <p className="question-text">Qual é o nível de maturação da manga?</p>
          <div className="radio-group">
            <div className="radio-item">
              <input type="radio" id="q2-1" name="question2" value="1" onChange={handleChange} required />
              <label htmlFor="q2-1">Verde</label>
            </div>
            <div className="radio-item">
              <input type="radio" id="q2-2" name="question2" value="2" onChange={handleChange} />
              <label htmlFor="q2-2">Quase madura</label>
            </div>
            <div className="radio-item">
              <input type="radio" id="q2-3" name="question2" value="3" onChange={handleChange} />
              <label htmlFor="q2-3">No ponto</label>
            </div>
            <div className="radio-item">
              <input type="radio" id="q2-4" name="question2" value="4" onChange={handleChange} />
              <label htmlFor="q2-4">Muito madura</label>
            </div>
          </div>
        </div>

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default App;
