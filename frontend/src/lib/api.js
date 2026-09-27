const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ====================
// User API
// ====================

export const createUser = async (user) => {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const loginUser = async (email) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// ====================
// Task API
// ====================

export const createTask = async (task) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const getTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const getUserTasks = async (userId) => {
  const response = await fetch(`${API_URL}/tasks/user/${userId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const getBlockedTasks = async () => {
  const response = await fetch(`${API_URL}/tasks/blocked`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const updateTask = async (id, task) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const completeTask = async (id) => {
  const response = await fetch(`${API_URL}/tasks/${id}/complete`, {
    method: "PATCH",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};