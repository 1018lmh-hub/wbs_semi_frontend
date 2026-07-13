import api from "../api/axios";
export const fetchCurrentCongestion = async () => {
  const res = await api.get("/rasp/current");
  return res.data.data;
};
export const fetchSerialCongestion = async () => {
  const res = await api.get("/rasp/serial");
  return res.data.data;
};
