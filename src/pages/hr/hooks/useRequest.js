import {useState} from 'react';

export const STATUSES = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
};

export default function useRequest(request) {
  const [status, setStatus] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    try {
      setStatus(STATUSES.LOADING);
      setData(null);
      setError(null);

      const response = await request(args);

      setStatus(STATUSES.SUCCESS);
      setData(response.data);
    } catch (err) {
      setStatus(STATUSES.FAIL);
      setError(err);
    }
  };

  return [{status, data, error}, execute];
}
