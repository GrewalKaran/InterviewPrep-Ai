import React from 'react'
import { useContext ,useEffect} from 'react'
import {AuthContext} from '../auth.context'
import { register,login,logout,getMe } from '../services/auth.api'



export const useAuth = () => {

    const context = useContext(AuthContext)
    const {user,setUser,loading,setLoading} = context

    async function handleLogin({email,password}){
        setLoading(true);
        try{
            const data = await login({email,password})
            setUser(data.user)
        }
        catch(err){
            console.log(err)
        }
        finally{
            setLoading(false)
        }
    }

    async function handleRegister({username,email,password}){
        setLoading(true);
        try{
            const data = await register({username,email,password})
            setUser(data.user)
        }
        catch(err){
            console.log(err)
        }
        finally{
            setLoading(false)
        }
        
    }

    async function handleLogout(){
            setLoading(true);
        try{
            const data = await logout()
            setUser(null)
        }
        catch(err){
            console.log(err)
        }
        finally{
            setLoading(false)
        }
      
    }

    useEffect(()=>{
        
            const getAndSetUser = async()=>{
        try{
            const data = await getMe();
            setUser(data.user);
        }
        catch(err){
            console.log(err)
        }finally{
            setLoading(false);
        }
    }
      
      getAndSetUser()
    },[])

  return {handleLogin,handleLogout,handleRegister,user,loading}
}

export default useAuth