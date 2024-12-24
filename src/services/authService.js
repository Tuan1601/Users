const API_URL = 'http://localhost:3000/api/auth'; // Đảm bảo API URL là chính xác

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error };
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    return { error: 'Không thể kết nối với server' };
  }
};

export const registerUser = async (userDetails) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error };
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    return { error: 'Không thể kết nối với server' };
  }
};
