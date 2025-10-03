import React from 'react';

function LocationPopup({ locations, selected, onClose, onSave, location }) {
  const [selectedLocations, setSelectedLocations] = React.useState(selected);

  const handleToggle = (loc) => {
    setSelectedLocations(prev => 
      prev.includes(loc) 
        ? prev.filter(l => l !== loc)
        : [...prev, loc]
    );
  };

  const handleSave = () => {
    onSave(selectedLocations);
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Selecione os sectores em {location}</h2>
        <div className="checklist">
          {locations.map(loc => (
            <label key={loc} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedLocations.includes(loc)}
                onChange={() => handleToggle(loc)}
              />
              {loc}
            </label>
          ))}
        </div>
        <div className="popup-buttons">
          <button onClick={handleSave}>Confirmar</button>
          <button onClick={onClose} className="secondary">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default LocationPopup;
