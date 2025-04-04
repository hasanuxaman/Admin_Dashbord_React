import axios from 'axios';

const API_URL = 'https://localhost:5000/'; // Change to your API URL

// Get all requisitions
export const getRequisitions = async () => {
  try {
    const response = await axios.get(API_URL+'api/Auth/GetUser');
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the requisitions:", error);
    throw error;
  }
};

// Create a new requisition
export const createRequisition = async (requisitionData) => {
  try {
    const response = await axios.post(API_URL+'api/PurchaseRequisition/CreateRequisition', requisitionData);
    return response.data;
  } catch (error) {
    console.error("There was an error creating the requisition:", error);
    throw error;
  }
};

// Update an existing requisition
export const updateRequisition = async (id, requisitionData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, requisitionData);
    return response.data;
  } catch (error) {
    console.error("There was an error updating the requisition:", error);
    throw error;
  }
};

// Delete a requisition
export const deleteRequisition = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("There was an error deleting the requisition:", error);
    throw error;
  }
};

// Add an item to a requisition
export const addItemToRequisition = async (requisitionId, item) => {
  try {
    const response = await axios.post(`${API_URL}/${requisitionId}/items`, item);
    return response.data;
  } catch (error) {
    console.error("There was an error adding the item to the requisition:", error);
    throw error;
  }
};

// Delete an item from a requisition
export const deleteItemFromRequisition = async (requisitionId, itemId) => {
  try {
    const response = await axios.delete(`${API_URL}/${requisitionId}/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("There was an error deleting the item from the requisition:", error);
    throw error;
  }
};
