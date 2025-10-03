const API_URL = process.env.REACT_APP_API_URL || 'https://api.escalar.pt';

export const submitMangometerData = async (data) => {
  try {
    const response = await fetch(`${API_URL}/insert`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': 'Bearer my_ultra_secret_token_that_is_totally_secure',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting data:', error);
    throw error;
  }
};
