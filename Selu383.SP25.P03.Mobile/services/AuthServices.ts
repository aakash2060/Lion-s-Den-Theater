import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'
const api_url = ' http://mastiff-kind-redfish.ngrok-free.app';

interface LoginCredentials{
    username: string,
    password: string
}

class AuthServices{
    async login(credentials:LoginCredentials){
        try{
            const response = await axios.post(`${api_url}/authentication/login`, credentials,{
                withCredentials:true,
                headers: {
                    "Content-Type": "application/json",
                }
            })
            // Store user info in async storage
            if(response.data.user){
                await AsyncStorage.setItem('user', JSON.stringify(response.data.user))
            }
            return response.data
        }
        catch(e){
            console.error('Log in Failed', e)
            throw console.error();
            
        }
          
    }
    async logout(){
        try{
            axios.post(`${api_url}/authentication/logout`, {},{withCredentials:true})
            // Clear the user data from Async Storage
            await AsyncStorage.removeItem('user');
        }
        catch(e){
            console.error("log out failed",e )

        }
    }
    async getCurrentUser() {
        try {
          const user = await AsyncStorage.getItem('user');
          return user ? JSON.parse(user) : null;
        } catch (error) {
          console.error('Error getting current user:', error);
          return null;
        }
      }

    async isAuthenticated (){
        try{
            const response = await axios.get(`${api_url}/authentication/me`, {withCredentials:true})
            return response.status === 200;
        }
        catch(e){
            console.error(e)
        }
    }
}
export default AuthServices;

