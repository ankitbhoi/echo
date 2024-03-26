import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from '../store/authSlice';


export function useLoadingWithRefresh() {
    const [loading, setLoading] = useState(true);
    
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            try{
                const {data} = await axios.get(
                    'http://localhost:5500/api/refresh', 
                    {
                        withCredentials: true,
                    }
                );
                
                // console.log(data);
                dispatch(setAuth(data));
                setLoading(false);
            }catch(err){
                console.log(' error ')
                console.log(err);
                setLoading(false);
            }
        })();
    }, []);
    // console.log(loading);
    return { loading };
}