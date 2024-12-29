import { useSignIn } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const redirectUrl =
        "https://cosmic-panther-54.accounts.dev/v1/oauth_callback";

      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl,
        redirectUrlComplete: AuthSession.makeRedirectUri({
          scheme: "studo", // Matches your app scheme in app.json
          path: "oauth/callback", // Deep link back to your app
        }),
      });

      console.log("Google Sign-In initiated successfully");
    } catch (err: any) {
      console.error("Google Sign-In Error: ", err);
      alert(err.errors?.[0]?.message || "Google Sign-In failed");
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />

      <TextInput
        autoCapitalize="none"
        placeholder="simon@galaxies.dev"
        value={emailAddress}
        onChangeText={setEmailAddress}
        style={styles.inputField}
      />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.inputField}
      />

      <Button onPress={onSignInPress} title="Login" color={"#6c47ff"} />

      <Button
        onPress={onGoogleSignIn}
        title="Sign in with Google"
        color={"#DB4437"}
      />

      <Link href="/reset" asChild>
        <Pressable style={styles.button}>
          <Text>Forgot password?</Text>
        </Pressable>
      </Link>
      <Link href="/register" asChild>
        <Pressable style={styles.button}>
          <Text>Create Account</Text>
        </Pressable>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#525252",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    margin: 8,
    alignItems: "center",
  },
});

export default Login;
