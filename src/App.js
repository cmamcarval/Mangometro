import React, { useState, useMemo } from "react";
import { submitMangometerData } from "./services/api";
import { auth } from "./firebase";
import "./App.css";
import LocationPopup from "./components/LocationPopup";

function App() {
  const [formData, setFormData] = useState({
    date: "",
    location: "",
    sublocation: [], // Change to array for multiple selections
    question1: "",
    question2: "",
    question3: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showHelpRock, setShowHelpRock] = useState(false);
  const [showHelpTemp, setShowHelpTemp] = useState(false);

  const locations = {
    "Atlântida": [
      "Bilfa",
      "Finisterra",
      "Gaivotas",
      "Grotta",
      "Grutinha",
      "Leve-leve",
      "Miradouro",
      "Parede grande",
      "Pátio das cantigas",
      "Ponta do ser",
      "Proa"
    ],
    "Mango": [
      "Arca Noé",
      "Baia",
      "Cabo da Boa Esperança",
      "Convés dos Piratas",
      "Degraus",
      "Éden",
      "Garganta Funda",
      "Juízo Final",
      "Olimpo",
      "Poças",
      "Princípio do Fim",
      "Santa Linha",
      "Smart",
      "Submarino"
    ]
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
      // Reset sublocation array if location changes
      ...(name === 'location' ? { sublocation: [] } : {})
    }));

    // Show popup when location is selected
    if (name === 'location' && value) {
      setShowPopup(true);
    }
  };

  const handleSublocations = (selectedLocations) => {
    setFormData(prev => ({
      ...prev,
      sublocation: selectedLocations
    }));
  };

  const formatSubmissionData = (data) => {
    return {
      user_id: auth.currentUser.email, // Use Firebase auth user ID
      table_name: "fieldData",
      payload: {
        assessment: {
          date: data.date,
          location: {
            main: data.location,
            sub: data.sublocation.join(', ') // Join array into string
          },
          ratings: {
            humidade: data.question1,
            mar: data.question2,
            temperatura: data.question3
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
        sublocation: [],
        question1: "",
        question2: "",
        question3: ""
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
           formData.sublocation.length > 0 && 
           formData.question1 !== "" && 
           formData.question2 !== "" && 
           formData.question3 !== "";
  }, [formData]);

  return (
    <>
    <div className="background"></div>
    <div className="container">
      <div className="header">
        <img src="./logo1.png" alt="Mango" className="logo" />
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
              <option value="Mango">Meio-Mango</option>
            </select>

            <div className="selected-locations">
              <button 
                type="button" 
                onClick={() => setShowPopup(true)}
                className="select-locations-btn"
                disabled={!formData.location}
              >
                {formData.sublocation.length 
                  ? `${formData.sublocation.length} sectores selecionados` 
                  : "Selecionar sectores"}
              </button>
            </div>
          </div>
        </div>
        
        <div className="question-block">
          <div className="question-card">
            <p className="question-text">QUANDO FOSTE ESCALAR?</p>
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
        </div>

        <div className="question-block">
          <div className="question-card">
            <div className="question-header">
              <p className="question-text">COMO ESTAVA A ROCHA?</p>
              <button 
                type="button" 
                className="help-button"
                onClick={() => setShowHelpRock(true)}
                >
                  ?
              </button>
            </div>
            <div className="button-radio-group1">
              <div className={`button-radio ${formData.question1 === "1" ? "selected" : ""}`}>
                <input 
                  type="radio" 
                  id="q1-1" 
                  name="question1" 
                  value="1" 
                  onChange={handleChange} 
                  required 
                />
                <label htmlFor="q1-1">Péssimo</label>
              </div>
              <div className={`button-radio ${formData.question1 === "2" ? "selected" : ""}`}>
                <input 
                  type="radio" 
                  id="q1-2" 
                  name="question1" 
                  value="2" 
                  onChange={handleChange} 
                />
                <label htmlFor="q1-2">Mau</label>
              </div>
              <div className={`button-radio ${formData.question1 === "3" ? "selected" : ""}`}>
                <input 
                  type="radio" 
                  id="q1-3" 
                  name="question1" 
                  value="3" 
                  onChange={handleChange} 
                />
                <label htmlFor="q1-3">Ok se secares presas</label>
              </div>
              <div className={`button-radio ${formData.question1 === "4" ? "selected" : ""}`}>
                <input 
                  type="radio" 
                  id="q1-4" 
                  name="question1" 
                  value="4" 
                  onChange={handleChange} 
                />
                <label htmlFor="q1-4">Seco</label>
              </div>
              <div className={`button-radio ${formData.question1 === "5" ? "selected" : ""}`}>
                <input 
                  type="radio" 
                  id="q1-5" 
                  name="question1" 
                  value="5" 
                  onChange={handleChange} 
                />
                <label htmlFor="q1-5">Perfeito</label>
              </div>
            </div>
          </div>

          <div className="question-card">
            <div className="question-header">
              <p className="question-text">SENSAÇÃO TÉRMICA?</p>
              <button 
                type="button" 
                className="help-button"
                onClick={() => setShowHelpTemp(true)}
              >
                ?
              </button>
            </div>
            <div className="button-radio-group2">
              <div className={`button-radio ${formData.question2 === "1" ? "selected" : ""}`}>
                <input 
                  type="radio" 
                  id="q2-1" 
                  name="question2" 
                  value="1" 
                  onChange={handleChange} 
                  required 
                />
                <label htmlFor="q2-1">Sauna</label>
              </div>
              <div className={`button-radio ${formData.question2 === "2" ? "selected" : ""}`}>
                <input 
                  type="radio" 
                  id="q2-2" 
                  name="question2" 
                  value="2" 
                  onChange={handleChange} 
                />
                <label htmlFor="q2-2">Tive de esperar que arrefecesse</label>
              </div>
              <div className={`button-radio ${formData.question2 === "3" ? "selected" : ""}`}>
                <input 
                  type="radio" 
                  id="q2-3" 
                  name="question2" 
                  value="3" 
                  onChange={handleChange} 
                />
                <label htmlFor="q2-3">Bom</label>
              </div>
              <div className={`button-radio ${formData.question2 === "4" ? "selected" : ""}`}>
                <input 
                  type="radio" 
                  id="q2-4" 
                  name="question2" 
                  value="4" 
                  onChange={handleChange} 
                />
                <label htmlFor="q2-4">Perfeito</label>
              </div>
            </div>
          </div>

          <div className="question-card">
            <p className="question-text">COMO ESTAVA O MAR?</p>
            <div className="button-radio-group3">
              <div className={`button-radio ${formData.question3 === "1" ? "selected" : ""}`}>
                <input 
                  type="radio" 
                  id="q3-1" 
                  name="question3" 
                  value="1" 
                  onChange={handleChange} 
                  required 
                />
                <label htmlFor="q3-1">Tempestuoso, não dá para aceder</label>
              </div>
              <div className={`button-radio ${formData.question3 === "2" ? "selected" : ""}`}>
                <input 
                  type="radio" 
                  id="q3-2" 
                  name="question3" 
                  value="2" 
                  onChange={handleChange} 
                />
                <label htmlFor="q3-2">Muito agitado, acesso com cuidado</label>
              </div>
              <div className={`button-radio ${formData.question3 === "3" ? "selected" : ""}`}>
                <input 
                  type="radio" 
                  id="q3-3" 
                  name="question3" 
                  value="3" 
                  onChange={handleChange} 
                />
                <label htmlFor="q3-3">Agitado, arricas a molhar-te</label>
              </div>
              <div className={`button-radio ${formData.question3 === "4" ? "selected" : ""}`}>
                <input 
                  type="radio" 
                  id="q3-4" 
                  name="question3" 
                  value="4" 
                  onChange={handleChange} 
                />
                <label htmlFor="q3-4">Tranquilo</label>
              </div>
              <div className={`button-radio ${formData.question3 === "5" ? "selected" : ""}`}>
                <input 
                  type="radio" 
                  id="q3-5" 
                  name="question3" 
                  value="5" 
                  onChange={handleChange} 
                />
                <label htmlFor="q3-5">Sopa</label>
              </div>
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

      {showPopup && (
        <LocationPopup
          locations={locations[formData.location] || []}
          selected={formData.sublocation}
          onClose={() => setShowPopup(false)}
          onSave={handleSublocations}
          location={formData.location}
        />
      )}

      {showHelpRock && (
        <>
          <div className="help-overlay" onClick={() => setShowHelpRock(false)} />
          <div className="help-popup">
            <p className="help-popup-title">Grip</p>
            <p></p>
            <p><b>Péssimo:</b> Nem valia a pena escalar porque as presas estavam húmidas/molhadas. Não escalamos no(s) sector(es) por causa da húmidade. </p>
            <p></p>
            <p><b>Mau:</b> Estava bastante húmido. Deu para escalar baixando o grau e pondo muito magnésio nas presas mas estavam más condições. </p>
            <p></p>
            <p><b>Ok depois de secar as presas:</b> Um dia razoável, limpando e pondo magnésio nas presas deu para escalar e aproveitar. </p>
            <p></p>
            <p><b>Seco:</b> As condições estavam boas para tentar vias no limite mas não estavam perfeitas. </p>
            <p></p>
            <p><b>Perfeito:</b> O grip está incrível sendo difícil imaginar como é que as condições poderiam estar melhores. Um dia igual aos melhores dias que te lembras. </p>
            <button onClick={() => setShowHelpRock(false)}>Fechar</button>
          </div>
        </>
      )}

      {showHelpTemp && (
        <>
          <div className="help-overlay" onClick={() => setShowHelpTemp(false)} />
          <div className="help-popup">
          <p className="help-popup-title">Sensação Térmica</p>
            <p></p>
            <p><b>Sauna:</b> Estava muito quente, passei mal com o calor. A janela de tempo com uma temperatura razoável para escalar foi muito curta.</p>
            <p></p>
            <p><b>Tive de esperar que arrefecesse:</b> Estava calor e tive de esperar que a temperatura baixasse para escalar.</p>
            <p></p>
            <p><b>Bom:</b> Estava uma boa temperatura para tentar vias no limite e aproveitar o dia apesar de não estar perfeito.</p>
            <p></p>
            <p><b>Perfeito:</b> A temperatura não podia estar melhor, a temperatura ideal para encadear e ter um bom dia de escalada.</p>
            <button onClick={() => setShowHelpTemp(false)}>Fechar</button>
          </div>
        </>
      )}
    </div>
    </>
  );
}

export default App;
