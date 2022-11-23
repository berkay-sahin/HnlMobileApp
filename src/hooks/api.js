import React from 'react'
import axios from "axios";

const baseURL = 'https://api.hanelgroup.com/api/main'

export const useApi = (props) => {

    let axiosConfig = {
        method: null,
        url: null,
        baseURL: baseURL,
        params: "",
        data: "",
        headers: {
          "Access-Control-Allow-Origin":"*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type,  Accept, x-client-key, x-client-token, x-client-secret, Authorization",
          'Access-Control-Allow-Private-Network': true,
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
         
        }
    } 
    const get = async (url,data)=>{
        try {
            axiosConfig.url=url;
            axiosConfig.method="get";
            axiosConfig.params=data;

            var response = await axios(axiosConfig);
         
            return response;
            
        } catch (error) {
            return error; 
        }
    }

    const post = async (url,data)=>{
        try {
            axiosConfig.url=url;
            axiosConfig.method="post";
            axiosConfig.data=data;

            var response = await axios(axiosConfig);
           
            return response;
             
        } catch (error) {
            return error; 
        }
    }

    const remove = async (url,data)=>{
        try {
            axiosConfig.url=url;
            axiosConfig.method="delete";
            axiosConfig.params=data;

            var response = await axios(axiosConfig);
            
            return response;
            
        } catch (error) {
            return error; 
        }
    }

    return{
        post,
        get,
        remove
    } 
}