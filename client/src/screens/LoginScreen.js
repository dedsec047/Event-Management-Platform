import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../utils/api'; // Make sure your axios instance is correctly configured

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            console.log('Login request payload:', { email, password }); // Log the data being sent
            const response = await axios.post('/api/auth/login', { email, password });
            console.log('Login response:', response.data); // Log the server response
            if (response.data.token) {
                await AsyncStorage.setItem('token', response.data.token);
                alert('Login Successful');
                navigation.navigate('Home');
            } else {
                alert('Login failed: No token received');
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            if (error.response) {
                alert(error.response?.data?.message || 'Login failed');
            } else {
                alert('Network error, please try again.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Register" onPress={() => navigation.navigate('Register')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default LoginScreen;
