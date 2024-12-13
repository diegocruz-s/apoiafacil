import axios from "axios";

export const api = axios.create({
  baseURL: 'http://api_container:3333',
});
