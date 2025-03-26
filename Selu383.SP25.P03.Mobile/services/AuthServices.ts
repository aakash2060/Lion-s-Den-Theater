import axios from 'axios';
const api_url = 'https://45b7-209-205-139-199.ngrok-free.app';  // Use https one from ngrok here and http in .env file

interface LoginCredentials{
    username: string,
    password: string
}

class AuthServices{
    async login(credentials: LoginCredentials) {
        try {
            const response = await axios.post(`${api_url}/api/authentication/login`, credentials, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                }
            });

            // Ensure response data contains a user object
            if (response.data && response.data.user) {
                return response.data; // Return the entire response containing user
            } else {
                throw new Error("User not found in response.");
            }
        } catch (e) {
            console.error("Login Failed:", e);
            throw e;  // Ensure errors are propagated correctly
        }
    }
 
    
    async logout() {
        try {
            await axios.post(`${api_url}/authentication/logout`, {}, { withCredentials: true });
        } catch (e) {
            console.error("Logout failed:", e);
        }
    }
    
    async getCurrentUser() {
        try {
            const response = await axios.get(`${api_url}/api/authentication/me`, { withCredentials: true });
            console.log("Fetched user from /me:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching user from /me:", error);
            return null;
        }
    }
    

      async isAuthenticated() {
        try {
            const response = await axios.get(`${api_url}/authentication/me`, { withCredentials: true });
            console.log("Auth check response:", response.status);
            return response.status === 200;
        } catch (e) {
            console.error("Auth check failed:", e);
            return false;
        }
    }
    
}
export default AuthServices;

