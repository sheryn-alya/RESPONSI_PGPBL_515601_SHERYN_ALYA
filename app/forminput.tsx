import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const TextInputExample = () => {
    const [text, onChangeText] = React.useState('');
    const [number, onChangeNumber] = React.useState('');
    const [email, onChangeEmail] = React.useState('');
    const [Class, onChangeClass] = React.useState('');

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Stack.Screen 
                    options={{ 
                        title: 'FORM INPUT',
                        headerStyle: { backgroundColor: '#fff' }, // header putih
                        headerTintColor: '#d63384', // teks header pink lembut
                        headerTitleStyle: { fontWeight: 'bold' },
                    }} 
                />
                
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={text}
                    placeholder="Nama Lengkap"
                    placeholderTextColor="#d97a9c"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeNumber}
                    value={number}
                    placeholder="NIM"
                    placeholderTextColor="#d97a9c"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeClass}                    
                    value={Class}
                    placeholder="Kelas"
                    placeholderTextColor="#d97a9c"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeEmail}
                    value={email}
                    placeholder="Email UGM"
                    placeholderTextColor="#d97a9c"
                    keyboardType="email-address"
                />
                
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // latar tetap putih
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        color: '#333',
        height: 45,
        marginVertical: 8,
        borderWidth: 1.2,
        borderColor: '#f5a3c1', // border pink lembut
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#ff69b4', // tombol pink cerah
        paddingVertical: 12,
        marginTop: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default TextInputExample;
