import React, { useState } from 'react';
import { useFetch } from './fetch/fetch';

const FetchTest = () => {
  let [id, setId] = useState(1);

  let data = useFetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  let todo = data.read();

  return <div onClick={() => setId(2)}>{todo.title}</div>;
};

export default FetchTest;
