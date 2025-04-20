import {
    View,
    Text,
    TextInput,
    Pressable,
    Image,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
  } from "react-native";
  import axios from "axios";
  import { useRouter, Link } from "expo-router";
  import React, { useState } from "react";
  import { BASE_URL } from "@/constants/baseUrl";
  
  export default function Register() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
  
    const onSubmit = async () => {
      setError("");
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      try {
        const clientUri = BASE_URL;
        await axios.post(
          `${BASE_URL}/api/users`,
          {
            firstName,
            lastName,
            email,
            username,
            password,
            roles: ["User"],
            clientUri,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        router.push("/(auth)/login");
      } catch (e) {
        if (axios.isAxiosError(e)) {
          setError(e.response?.data?.message || "Registration failed");
        } else {
          setError("An unexpected error occurred");
        }
        console.error("Registration Failed", e);
      }
    };
  
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 bg-black justify-center items-center px-6"
        >
          {/* Logo */}
          <Image
            source={require("@/assets/images/logos.png")}
            style={{ width: 100, height: 100, marginBottom: 24 }}
            resizeMode="contain"
          />
  
          {/* Title */}
          <Text className="text-white text-2xl font-bold text-center mb-6">
            Create an Account
          </Text>
  
          {/* Form */}
          <TextInput
            className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-600 mb-3"
            placeholder="First Name"
            placeholderTextColor="#9CA3AF"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-600 mb-3"
            placeholder="Last Name"
            placeholderTextColor="#9CA3AF"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-600 mb-3"
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-600 mb-3"
            placeholder="Username"
            placeholderTextColor="#9CA3AF"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-600 mb-3"
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-600 mb-3"
            placeholder="Confirm Password"
            placeholderTextColor="#9CA3AF"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
  
          {/* Error Message */}
          {error ? (
            <Text className="text-red-500 text-sm text-center mb-3">
              {error}
            </Text>
          ) : null}
  
          {/* Register Button */}
          <Pressable
            className="w-full bg-red-600 py-3 mt-4 rounded-md"
            onPress={onSubmit}
          >
            <Text className="text-white font-semibold text-center text-lg">
              Register
            </Text>
          </Pressable>
  
          {/* Link to Login */}
          <View className="mt-6 flex-row justify-center">
            <Text className="text-gray-400">Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-red-400 font-semibold">Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
  