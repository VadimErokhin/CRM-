const baseUrl = 'http://127.0.0.1:3000/api';

const request = async (url, options) => {
  const response = await fetch(`${baseUrl}${url}`, options);
  const json = await response.json();

  return json;
}

export const fetchUsers = async (search) => {
  const params = search ? `?search=${search}` : '';
  const users = await request(`/clients${params}`);

  return users;
}

export const postUser = async (user) => {
  const response = await request('/clients', {
    method: 'POST',
    body: JSON.stringify(user)
  });

  return response;
}

export const patchUser = async (user, id) => {
  const client = await request(`/clients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(user)
  });

  return client;
}

export const deleteUser = async (id) => {
  const response = await request(`/clients/${id}`, {
    method: 'DELETE'
  });
}

export const fetchUser = async (id) => {
  const response = await request(`/clients/${id}`, {
    method: 'GET'
  });

  return response;
}