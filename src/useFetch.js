import { useEffect, useState } from "react";

const useFetch = (url,params,setParams) => {

    const [query,setQuery] = useState('');

    const [data,setData] = useState(null);

    useEffect(()=>{

        if(query!==''){

            setParams({
                ...params,
                q:query
            })
        }
    },[query])
    
    useEffect(()=>{

        const abortCont = new AbortController();

        if(params.q!=='' || params.q==undefined){

            const new_params = new URLSearchParams(params).toString();

            fetch(url+new_params,{ signal:abortCont.signal})
            .then((res)=>res.json())
            .then((data)=>setData(data));
        }

        return ()=>abortCont.abort();
    },[params])
    
    return ({setQuery,data,setData});
}
 
export default useFetch;