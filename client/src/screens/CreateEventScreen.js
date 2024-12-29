import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../utils/api';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'; // For Date Picker

const CreateEventScreen = ({ route, navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date()); // Initialize with current date
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('Music');
    const [visibility, setVisibility] = useState('public');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [eventId, setEventId] = useState(null);

    // Prefill data if editing an event
    useEffect(() => {
        if (route.params?.event) {
            const { event } = route.params;
            setEventId(event._id);
            setTitle(event.title);
            setDescription(event.description);
            setDate(new Date(event.date));
            setLocation(event.location);
            setCategory(event.category);
            setVisibility(event.visibility);
        }
    }, [route.params?.event]);

    const handleCreateEvent = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(
                '/api/events/create',
                { title, description, date, location, category, visibility },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Event created successfully!');
            navigation.navigate('Home');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create event');
        }
    };

    const handleEditEvent = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.put(
                `/api/events/edit/${eventId}`,
                { title, description, date, location, category, visibility },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Event updated successfully!');
            navigation.navigate('Home');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update event');
        }
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios' ? true : false);
        setDate(currentDate);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{eventId ? 'Edit Event' : 'Create Event'}</Text>
            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                placeholderTextColor="#888"
                value={title}
                onChangeText={setTitle}
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.input}
                placeholder="Description"
                placeholderTextColor="#888"
                value={description}
                onChangeText={setDescription}
            />

            <Text style={styles.label}>Date</Text>
            <Button onPress={() => setShowDatePicker(true)} title={`Select Date: ${date.toDateString()}`} />
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
            <Text style={styles.label}>Location</Text>
            <TextInput
                style={styles.input}
                placeholder="Location"
                placeholderTextColor="#888"
                value={location}
                onChangeText={setLocation}
            />
            <Text style={styles.label}>Category</Text>
            <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.input}
            >
                <Picker.Item label="Music" value="Music" />
                <Picker.Item label="Tech" value="Tech" />
                <Picker.Item label="Sports" value="Sports" />
                <Picker.Item label="Art" value="Art" />
            </Picker>

            <Text style={styles.label}>Visibility</Text>
            <Picker
                selectedValue={visibility}
                onValueChange={(itemValue) => setVisibility(itemValue)}
                style={styles.input}
            >
                <Picker.Item label="Public" value="public" />
                <Picker.Item label="Private" value="private" />
            </Picker>

            <Button title={eventId ? 'Update Event' : 'Create Event'} onPress={eventId ? handleEditEvent : handleCreateEvent} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff', // Make sure the background is white
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
        color: '#000', // Text color for input
    },
    label: {
        marginTop: 10,
        fontWeight: 'bold',
    },
});

export default CreateEventScreen;
