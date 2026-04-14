import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS } from '../constants/colors';

interface Props extends TextInputProps { label: string; }

export default function InputField({ label, ...props }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        style={styles.input} 
        placeholderTextColor={COLORS.texteMuted}
        accessibilityLabel={label} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontSize: 13, fontWeight: '500', color: COLORS.titreDark },
  input: {
    backgroundColor: COLORS.fondPage, borderWidth: 1.5, borderColor: COLORS.violetBorder,
    borderRadius: 12, padding: 12, fontSize: 15, color: COLORS.titreDark,
  },
});