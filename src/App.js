import React, { useState, useMemo } from "react";
import { submitMangometerData } from "./services/api";
import { auth } from "./firebase";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    date: "",
    location: "",
    sublocation: "",
    question1: "",
    question2: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const locations = {
    "Atlântida": ["Proa", "Deck", "Outro"],
    "Mango": ["Poças", "Santa linha", "Margem sul"]
  };

  const getDates = () => {
    const today = new Date();
    const yesterday = new Date(today);
    const twoDaysAgo = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    return {
      today: today.toISOString().split('T')[0],
      yesterday: yesterday.toISOString().split('T')[0],
      twoDaysAgo: twoDaysAgo.toISOString().split('T')[0]
    };
  };

  const dates = getDates();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset sublocation if location changes
      ...(name === 'location' ? { sublocation: '' } : {})
    }));
  };

  const formatSubmissionData = (data) => {
    return {
      user_id: auth.currentUser.uid, // Use Firebase auth user ID
      table_name: "remove_me",
      payload: {
        metadata: {
          submittedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
        },
        assessment: {
          date: data.date,
          location: {
            main: data.location,
            sub: data.sublocation
          },
          ratings: {
            sweetness: parseInt(data.question1),
            ripeness: parseInt(data.question2)
          }
        }
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formattedData = formatSubmissionData(formData);
      const response = await submitMangometerData(formattedData);
      console.log("Submission successful:", response);
      alert("Obrigado! Suas respostas foram enviadas com sucesso.");
      // Optional: Reset form
      setFormData({
        date: "",
        location: "",
        sublocation: "",
        question1: "",
        question2: ""
      });
    } catch (error) {
      setSubmitError("Erro ao enviar as respostas. Por favor, tente novamente.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormComplete = useMemo(() => {
    return formData.date !== "" && 
           formData.location !== "" && 
           formData.sublocation !== "" && 
           formData.question1 !== "" && 
           formData.question2 !== "";
  }, [formData]);

  return (
    <div className="container">
      <div className="header">
        <span className="logo" role="img" aria-label="mango">🥭</span>
        <h1>Mangómetro</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="mango-form">

        <div className="question-block">
          <div className="location-selectors">
            <select 
              name="location" 
              value={formData.location} 
              onChange={handleChange}
              required
              className="location-dropdown"
            >
              <option value="">Selecione o local</option>
              <option value="Atlântida">Atlântida</option>
              <option value="Mango">Mango</option>
            </select>

            {formData.location && (
              <select 
                name="sublocation" 
                value={formData.sublocation} 
                onChange={handleChange}
                required
                className="location-dropdown"
              >
                <option value="">Selecione o sublocal</option>
                {locations[formData.location].map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        
        <div className="question-block">
          <p className="question-text">Quando provaste a manga?</p>
          <div className="button-radio-group">
            <div className={`button-radio ${formData.date === dates.twoDaysAgo ? "selected" : ""}`}>
              <input 
                type="radio" 
                id="date-1" 
                name="date" 
                value={dates.twoDaysAgo}
                onChange={handleChange} 
                required 
              />
              <label htmlFor="date-1">2 dias atrás</label>
            </div>
            <div className={`button-radio ${formData.date === dates.yesterday ? "selected" : ""}`}>
              <input 
                type="radio" 
                id="date-2" 
                name="date" 
                value={dates.yesterday}
                onChange={handleChange} 
              />
              <label htmlFor="date-2">Ontem</label>
            </div>
            <div className={`button-radio ${formData.date === dates.today ? "selected" : ""}`}>
              <input 
                type="radio" 
                id="date-3" 
                name="date" 
                value={dates.today}
                onChange={handleChange} 
              />
              <label htmlFor="date-3">Hoje</label>
            </div>
          </div>
        </div>

        <div className="question-block">
          <p className="question-text">Qual é o nível de doçura da manga?</p>
          <div className="button-radio-group">
            <div className={`button-radio ${formData.question1 === "1" ? "selected" : ""}`}>
              <input 
                type="radio" 
                id="q1-1" 
                name="question1" 
                value="1" 
                onChange={handleChange} 
                required 
              />
              <label htmlFor="q1-1">Muito ácida</label>
            </div>
            <div className={`button-radio ${formData.question1 === "2" ? "selected" : ""}`}>
              <input 
                type="radio" 
                id="q1-2" 
                name="question1" 
                value="2" 
                onChange={handleChange} 
              />
              <label htmlFor="q1-2">Pouco doce</label>
            </div>
            <div className={`button-radio ${formData.question1 === "3" ? "selected" : ""}`}>
              <input 
                type="radio" 
                id="q1-3" 
                name="question1" 
                value="3" 
                onChange={handleChange} 
              />
              <label htmlFor="q1-3">Doce</label>
            </div>
            <div className={`button-radio ${formData.question1 === "4" ? "selected" : ""}`}>
              <input 
                type="radio" 
                id="q1-4" 
                name="question1" 
                value="4" 
                onChange={handleChange} 
              />
              <label htmlFor="q1-4">Muito doce</label>
            </div>
          </div>

          <p className="question-text">Qual é o nível de maturação da manga?</p>
          <div className="button-radio-group">
            <div className={`button-radio ${formData.question2 === "1" ? "selected" : ""}`}>
              <input 
                type="radio" 
                id="q2-1" 
                name="question2" 
                value="1" 
                onChange={handleChange} 
                required 
              />
              <label htmlFor="q2-1">Verde</label>
            </div>
            <div className={`button-radio ${formData.question2 === "2" ? "selected" : ""}`}>
              <input 
                type="radio" 
                id="q2-2" 
                name="question2" 
                value="2" 
                onChange={handleChange} 
              />
              <label htmlFor="q2-2">Quase madura</label>
            </div>
            <div className={`button-radio ${formData.question2 === "3" ? "selected" : ""}`}>
              <input 
                type="radio" 
                id="q2-3" 
                name="question2" 
                value="3" 
                onChange={handleChange} 
              />
              <label htmlFor="q2-3">No ponto</label>
            </div>
            <div className={`button-radio ${formData.question2 === "4" ? "selected" : ""}`}>
              <input 
                type="radio" 
                id="q2-4" 
                name="question2" 
                value="4" 
                onChange={handleChange} 
              />
              <label htmlFor="q2-4">Muito madura</label>
            </div>
          </div>
        </div>

        {submitError && (
          <div className="error-message">
            {submitError}
          </div>
        )}

        <button 
          type="submit" 
          className={isFormComplete ? 'enabled' : ''}
          disabled={!isFormComplete || isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}

export default App;
