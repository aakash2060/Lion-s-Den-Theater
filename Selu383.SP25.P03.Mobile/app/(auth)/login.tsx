import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AuthContext } from "@/context/AuthContext";
import { Link, useRouter } from "expo-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const router = useRouter();

  if (!auth) return null;

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const user = await auth.signin(username, password);

      if (!user) {
        setError("Login failed. Please try again.");
        return;
      }

      router.replace("/(tabs)" as any);
    } catch (e) {
      console.error("Login Failed", e);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
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
        <View className="mb-8 w-full">
          <Text className="text-white text-3xl font-bold text-center">
            Welcome Back
          </Text>
          <Text className="text-gray-400 text-center mt-2">
            Please sign in to continue
          </Text>
        </View>

        {/* Error Message */}
        {error ? (
          <View className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-md w-full">
            <Text className="text-red-500 text-center">{error}</Text>
          </View>
        ) : null}

        {/* Username Input */}
        <View className="mb-4 w-full">
          <Text className="text-gray-300 mb-2 font-semibold">Username</Text>
          <TextInput
            className="bg-gray-800 text-white p-4 rounded-md border border-gray-700"
            placeholder="Enter your username"
            placeholderTextColor="#9CA3AF"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View className="mb-6 w-full">
          <Text className="text-gray-300 mb-2 font-semibold">Password</Text>
          <TextInput
            className="bg-gray-800 text-white p-4 rounded-md border border-gray-700"
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          className={`w-full py-3 rounded-md bg-red-600 ${
            loading ? "opacity-70" : ""
          }`}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white font-bold text-center text-lg">
            {loading ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        {/* Navigation to Register */}
        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-400">Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text className="text-red-400 font-semibold">Register</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
