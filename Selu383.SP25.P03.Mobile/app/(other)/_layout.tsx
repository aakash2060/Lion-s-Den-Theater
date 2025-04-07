
import { Stack } from "expo-router";

export default function OtherPageTheme(){
    return (
        <>
        <Stack
        screenOptions={{
            headerShown:false
        }}>
            <Stack.Screen
            name="movieDetails"
            options={{
                title: 'movieDetails',
                animation:'default'
            }}
            
            />

           

        </Stack>
        </>
    )

}

