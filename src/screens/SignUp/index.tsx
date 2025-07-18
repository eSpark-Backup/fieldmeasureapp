import { View, Text, StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';

const SignUp = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f9fafb',
        padding: 20,
      }}
    ></View>
  );
};

const styles = StyleSheet.create({
  initialContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    paddingVertical: 30,
    marginVertical: 20,
    backgroundColor: 'white',
    gap: 10,
  },
  newContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: '#2975D2',
    paddingVertical: 25,
    marginVertical: 20,
  },
});

export default SignUp;
