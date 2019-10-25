//@ts-ignore
import { useState, useEffect, useTransition } from 'react';

// Suspense integrations like Relay implement
// a contract like this to integrate with React.
// Real implementations can be significantly more complex.
// Don't copy-paste this into your project!
function wrapPromise(promise: Promise<any>) {
  let status = 'pending';
  let result: any;
  let suspender = promise.then(
    r => {
      status = 'success';
      result = r;
    },
    e => {
      status = 'error';
      result = e;
    },
  );
  return {
    read: () => {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      } else if (status === 'success') {
        return result;
      }
    },
  };
}

type FetchData = {
  read?: any;
  isPending?: boolean;
};
const doFetch = (url: string, options?: RequestInit) => {
  const stuff = async () => {
    let response = await fetch(url, options);

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = await response.text();
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    return data;
  };

  return wrapPromise(stuff());
};

const transitionConfg = { timeoutMs: 500 };

export const useFetch = (url: string, options?: RequestInit): FetchData => {
  const [startTransition, isPending] = useTransition(transitionConfg);
  const [data, setData] = useState();

  useEffect(() => {
    startTransition(() => {
      setData(doFetch(url, options));
    });
  }, [url, options, startTransition]);

  if (data) return { ...data, isPending };
  return { read: () => true };
};
